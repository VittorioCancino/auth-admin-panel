import NextAuth from "next-auth";
import type { OIDCConfig } from "next-auth/providers";

interface HydraProfile {
  sub: string;
  email?: string;
  name?: string;
}

function getRequiredEnv(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing ${name} environment variable.`);
  }

  return value;
}

function normalizeIssuerUrl(value: string): string {
  return value.replace(/\/+$/, "") + "/";
}

function HydraProvider(): OIDCConfig<HydraProfile> {
  const issuer = normalizeIssuerUrl(getRequiredEnv("AUTH_HYDRA_ISSUER"));

  return {
    id: "hydra",
    name: "Hydra",
    type: "oidc",
    issuer,
    wellKnown: `${issuer}.well-known/openid-configuration`,
    clientId: getRequiredEnv("AUTH_HYDRA_ID"),
    clientSecret: getRequiredEnv("AUTH_HYDRA_SECRET"),
    checks: ["pkce", "state"],
    client: {
      token_endpoint_auth_method: "client_secret_basic",
    },
    authorization: {
      params: {
        audience: getRequiredEnv("AUTH_HYDRA_AUDIENCE"),
        scope: getRequiredEnv("AUTH_HYDRA_SCOPE"),
      },
    },
    profile(profile) {
      return {
        id: profile.sub,
        email: profile.email,
        name: profile.name ?? profile.email ?? profile.sub,
      };
    },
  };
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/",
  },
  providers: [HydraProvider()],
  callbacks: {
    async jwt({ token, account, profile, user }) {
      if (user) {
        token.sub = user.id ?? token.sub;
        token.email = user.email ?? token.email;
        token.name = user.name ?? token.name;
      }

      if (profile?.sub) {
        token.sub = profile.sub;
      }

      if (account?.access_token) {
        token.hydraAccessToken = account.access_token;
      }

      if (account?.refresh_token) {
        token.hydraRefreshToken = account.refresh_token;
      }

      return token;
    },
    async session({ session, token }) {
      if (!session.user || !token.sub) {
        return session;
      }

      session.user.id = token.sub;
      session.user.email = token.email ?? "";
      session.user.name = token.name ?? "Hydra User";

      return session;
    },
  },
});

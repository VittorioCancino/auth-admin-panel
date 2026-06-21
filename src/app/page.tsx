import { signIn } from "@/auth";

export default function Home() {
  async function authenticate() {
    "use server";

    await signIn("hydra", {
      redirectTo: "/admin/clients",
    });
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-ghost-white px-6 py-10 text-carbon-black sm:px-8">
      <div className="grid w-full max-w-5xl gap-10 lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-16">
        <section className="flex flex-col justify-center">
          <div className="max-w-2xl">
            <p className="font-[var(--font-geist-mono)] text-[0.72rem] uppercase tracking-[0.28em] text-cerulean/70">
              Hydra Admin Console
            </p>
            <h1 className="mt-5 font-[var(--font-display)] text-5xl leading-tight tracking-[-0.04em] text-carbon-black sm:text-6xl">
              Sign in to continue.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-neutral">
              Restricted access for internal operators managing clients,
              credentials, and identity platform settings.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap gap-3 text-sm text-neutral">
            <span className="rounded-full border border-turquoise-surf bg-white px-4 py-2">
              Internal access only
            </span>
            <span className="rounded-full border border-turquoise-surf bg-white px-4 py-2">
              Server-side admin routes
            </span>
          </div>
        </section>

        <section className="flex items-center">
          <div className="w-full rounded-[2rem] border border-turquoise-surf bg-white p-6 shadow-[0_20px_60px_rgba(2,132,199,0.08)] sm:p-8">
            <div>
              <p className="font-[var(--font-geist-mono)] text-[0.72rem] uppercase tracking-[0.24em] text-cerulean/70">
                Administrator Login
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-carbon-black">
                Continue to admin
              </h2>
              <p className="mt-3 text-sm leading-7 text-neutral">
                You will be redirected through Hydra and the shared login
                server before returning to this console.
              </p>
            </div>

            <form action={authenticate} className="mt-8 grid gap-5">
              <div className="rounded-2xl bg-ghost-white p-4 text-sm leading-7 text-neutral">
                The admin panel no longer stores administrator passwords. Hydra
                delegates browser login to the platform login server.
              </div>

              <div className="flex justify-end text-sm text-neutral">
                <span className="font-[var(--font-geist-mono)] text-[0.68rem] uppercase tracking-[0.22em] text-cerulean/55">
                  OIDC session
                </span>
              </div>

              <button
                type="submit"
                className="rounded-2xl bg-carbon-black px-5 py-3.5 text-sm font-semibold text-ghost-white transition hover:bg-cerulean"
              >
                Continue with Hydra
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}

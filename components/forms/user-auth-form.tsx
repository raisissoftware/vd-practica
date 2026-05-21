"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { userAuthSchema } from "@/lib/validations/auth";
import { toast } from "sonner";
import { TwoFactorScreen } from "@/components/forms/two-factor-screen";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: string;
}

type FormData = z.infer<typeof userAuthSchema>;

export function UserAuthForm({ className, type, ...props }: UserAuthFormProps) {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(userAuthSchema),
  });

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [showPassword, setShowPassword] = React.useState<boolean>(false);

  // 2FA state
  const [authStep, setAuthStep] = React.useState<"login" | "2fa">("login");
  const [tempToken, setTempToken] = React.useState<string | null>(null);

  const searchParams = useSearchParams();

  // ── Redirect after successful full login ──────────────────────────────────
  const handleSuccessRedirect = () => {
    toast.success("Conectare reușită!", { description: "Te redirecționăm..." });
    setTimeout(() => {
      const fromUrl = searchParams?.get("from");
      if (fromUrl && fromUrl !== "/login") {
        window.location.href = fromUrl;
      } else {
        window.location.href = "/admin";
      }
    }, 500);
  };

  // ── Step 1: password + 2FA gate ───────────────────────────────────────────
  async function onSubmit(data: FormData) {
    setIsLoading(true);

    // Register flow
    if (type === "register") {
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: data.email.toLowerCase(),
            password: data.password,
          }),
        });
        if (!res.ok) {
          const msg = await res.text();
          setIsLoading(false);
          return toast.error("Înregistrare eșuată", {
            description: msg || "Ceva nu a funcționat.",
          });
        }
        toast.success("Cont creat cu succes!");
        // Fall through to sign-in
      } catch {
        setIsLoading(false);
        return toast.error("Eroare de rețea");
      }
    }

    // Verify credentials & check 2FA requirement
    try {
      const verifyRes = await fetch("/api/auth/verify-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email.toLowerCase(),
          password: data.password,
        }),
      });

      if (!verifyRes.ok) {
        setIsLoading(false);
        return toast.error("Autentificare eșuată", {
          description: "Email sau parolă incorectă.",
        });
      }

      const result = await verifyRes.json();

      // Admin → show 2FA screen
      if (result.requires_2fa) {
        setTempToken(result.temporary_token);
        setAuthStep("2fa");
        setIsLoading(false);
        toast.info("Cod trimis!", {
          description: "Am trimis un cod de verificare pe email-ul tău.",
        });
        return;
      }

      // No 2FA needed (device trusted or regular user) → sign in directly
      const signInResult = await signIn("credentials", {
        email: data.email.toLowerCase(),
        password: data.password,
        redirect: false,
      });

      if (!signInResult || signInResult.error) {
        setIsLoading(false);
        return toast.error("Autentificare eșuată", {
          description: "Eroare la conectare. Încearcă din nou.",
        });
      }

      handleSuccessRedirect();
    } catch {
      setIsLoading(false);
      toast.error("Eroare", { description: "Ceva nu a funcționat." });
    }
  }

  // ── Step 2: verify OTP ─────────────────────────────────────────────────────
  const handleVerify2FA = async (code: string, trustDevice: boolean) => {
    setIsLoading(true);

    const signInResult = await signIn("credentials", {
      tempToken,
      code,
      trustDevice: trustDevice ? "true" : "false",
      redirect: false,
    });

    if (!signInResult || signInResult.error) {
      setIsLoading(false);
      return toast.error("Verificare eșuată", {
        description: "Codul introdus este incorect sau a expirat.",
      });
    }

    handleSuccessRedirect();
  };

  // ── Resend OTP ─────────────────────────────────────────────────────────────
  const handleResendOTP = async () => {
    const email = getValues("email");
    const password = getValues("password");
    try {
      const res = await fetch("/api/auth/verify-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.toLowerCase(), password }),
      });
      if (res.ok) {
        const result = await res.json();
        if (result.temporary_token) setTempToken(result.temporary_token);
        toast.success("Cod retrimis!");
      }
    } catch {
      toast.error("Nu am putut retrimite codul.");
    }
  };

  // ── 2FA screen ─────────────────────────────────────────────────────────────
  if (authStep === "2fa" && tempToken) {
    return (
      <div className={className} {...props}>
        <TwoFactorScreen
          email={getValues("email")}
          tempToken={tempToken}
          onVerify={handleVerify2FA}
          onBack={() => setAuthStep("login")}
          onResend={handleResendOTP}
          isLoading={isLoading}
        />
      </div>
    );
  }

  // ── Login / Register form ──────────────────────────────────────────────────
  return (
    <div
      className={cn(
        "flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-300",
        className,
      )}
      {...props}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="email"
            className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            Adresă Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="nume@companie.ro"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect="off"
            disabled={isLoading}
            className={cn(
              "h-10 w-full rounded-xl border bg-muted/40 px-3.5 text-sm text-foreground placeholder:text-muted-foreground/45 outline-none transition-all duration-150",
              "focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-500/15",
              "disabled:cursor-not-allowed disabled:opacity-50",
              errors?.email
                ? "border-rose-400/60"
                : "border-border/70",
            )}
            {...register("email")}
          />
          {errors?.email && (
            <p className="text-[11px] font-medium text-rose-500">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Parolă
            </label>
            {type !== "register" && (
              <button
                type="button"
                onClick={() =>
                  toast.info("Resetare Parolă", {
                    description:
                      "Contactează administratorul pentru resetarea parolei.",
                  })
                }
                className="text-[11px] font-semibold text-indigo-500 hover:text-indigo-600 transition-colors"
              >
                Ai uitat parola?
              </button>
            )}
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              autoComplete={
                type === "register" ? "new-password" : "current-password"
              }
              disabled={isLoading}
              className={cn(
                "h-10 w-full rounded-xl border bg-muted/40 pl-3.5 pr-10 text-sm text-foreground placeholder:text-muted-foreground/45 outline-none transition-all duration-150",
                "focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-500/15",
                "disabled:cursor-not-allowed disabled:opacity-50",
                errors?.password ? "border-rose-400/60" : "border-border/70",
              )}
              {...register("password")}
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/75 hover:text-foreground transition-colors"
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
          {errors?.password && (
            <p className="text-[11px] font-medium text-rose-500">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className={cn(
            "flex h-10 w-full items-center justify-center gap-2 rounded-xl mt-3",
            "bg-gradient-to-r from-indigo-600 to-blue-500 px-4 text-sm font-semibold text-white",
            "shadow-md shadow-indigo-500/25 transition-all duration-200",
            "hover:shadow-indigo-500/45 hover:scale-[1.01] active:scale-[0.98]",
            "disabled:pointer-events-none disabled:opacity-60",
          )}
        >
          {isLoading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <>
              {type === "register" ? "Creează Cont" : "Conectează-te"}
              <ArrowRight className="size-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}

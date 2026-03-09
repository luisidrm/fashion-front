"use client";

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { login, logout } from "./_slice/authSlice";
import { HomeBackground } from "@/components/home/HomeBackground";
import Link from "next/link";

interface AuthFormState {
  name: string;
  email: string;
  password: string;
  addressLine1: string;
  city: string;
  country: string;
}

type Mode = "login" | "register";

export default function AccountPage() {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);

  const [mode, setMode] = useState<Mode>("login");
  const [form, setForm] = useState<AuthFormState>({
    name: "",
    email: "",
    password: "",
    addressLine1: "",
    city: "",
    country: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email.trim()) return;
    dispatch(
      login({
        name: form.name || "Invitado",
        email: form.email,
        addressLine1: form.addressLine1,
        addressLine2: "",
        city: form.city,
        state: "",
        zipCode: "",
        country: form.country,
      })
    );
  };

  const handleLogout = () => dispatch(logout());
  const switchMode = (nextMode: Mode) => setMode(nextMode);

  // ── Authenticated view ──────────────────────────────────────────
  if (auth.isAuthenticated && auth.user) {
    return (
      <div className="relative min-h-screen">
        <HomeBackground />
        <div className="retro-grain" />
        <section className="relative z-10 flex min-h-screen items-center justify-center px-4 py-28 sm:px-6 lg:px-8">
          <div className="w-full max-w-3xl rounded-2xl border border-(--retro-cream)/15 bg-(--retro-deep)/75 p-8 shadow-xl shadow-black/40 backdrop-blur-md">
            <p className="font-(family-name:--font-dm-sans) text-xs uppercase tracking-[0.3em] text-(--retro-accent)">
              Mi cuenta
            </p>
            <h1 className="mt-4 font-(family-name:--font-playfair) text-3xl font-semibold text-(--retro-cream) sm:text-4xl">
              Hola, {auth.user.name || "invitado"}
            </h1>
            <p className="mt-3 font-(family-name:--font-dm-sans) text-sm text-(--retro-paper)/70">
              Tu sesión está iniciada en este dispositivo. Pronto verás aquí tu
              historial de pedidos y direcciones guardadas.
            </p>

            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <div className="rounded-xl border border-(--retro-cream)/10 bg-(--retro-dark)/60 p-5">
                <h2 className="font-(family-name:--font-playfair) text-sm uppercase tracking-[0.2em] text-(--retro-cream)">
                  Detalles
                </h2>
                <dl className="mt-4 space-y-3 font-(family-name:--font-dm-sans) text-sm text-(--retro-paper)/80">
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.2em] text-(--retro-paper)/50">Email</dt>
                    <dd className="mt-0.5">{auth.user.email}</dd>
                  </div>
                  {auth.user.addressLine1 && (
                    <div>
                      <dt className="text-[10px] uppercase tracking-[0.2em] text-(--retro-paper)/50">Dirección</dt>
                      <dd className="mt-0.5">
                        {auth.user.addressLine1}
                        {auth.user.city && `, ${auth.user.city}`}
                        {auth.user.country && `, ${auth.user.country}`}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>

              <div className="flex flex-col justify-between rounded-xl border border-(--retro-cream)/10 bg-(--retro-dark)/60 p-5">
                <div>
                  <h2 className="font-(family-name:--font-playfair) text-sm uppercase tracking-[0.2em] text-(--retro-cream)">
                    Próximamente
                  </h2>
                  <p className="mt-3 font-(family-name:--font-dm-sans) text-sm text-(--retro-paper)/70">
                    Gestión de pedidos, devoluciones y direcciones guardadas
                    directamente desde tu cuenta.
                  </p>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="inline-flex items-center justify-center border border-(--retro-cream)/40 bg-transparent px-5 py-2.5 font-(family-name:--font-dm-sans) text-xs font-medium uppercase tracking-[0.2em] text-(--retro-cream) transition-colors hover:bg-(--retro-cream)/10"
                  >
                    Cerrar sesión
                  </button>
                  <Link
                    href="/shop"
                    className="inline-flex items-center justify-center bg-(--retro-terracota) px-5 py-2.5 font-(family-name:--font-dm-sans) text-xs font-medium uppercase tracking-[0.2em] text-white transition-colors hover:bg-(--retro-rust)"
                  >
                    Ir a la tienda
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // ── Login / Register view ───────────────────────────────────────
  return (
    <div className="relative min-h-screen">
      <HomeBackground />
      <div className="retro-grain" />

      <section className="relative z-10 flex min-h-screen items-center justify-center px-4 py-28 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">

          {/* Header */}
          <div className="mb-8 text-center">
            <p className="font-(family-name:--font-dm-sans) text-[10px] uppercase tracking-[0.35em] text-(--retro-accent)">
              {mode === "login" ? "Bienvenido de vuelta" : "Únete a nosotros"}
            </p>
            <h1 className="mt-3 font-(family-name:--font-playfair) text-4xl font-semibold text-(--retro-cream)">
              {mode === "login" ? "Accede a tu archivo" : "Crea tu cuenta"}
            </h1>
            <div className="mx-auto mt-4 h-px w-12 bg-(--retro-accent)/50" />
          </div>

          {/* Card */}
          <div className="rounded-2xl border border-(--retro-cream)/12 bg-(--retro-deep)/80 p-8 shadow-2xl shadow-black/50 backdrop-blur-md">

            {/* Mode toggle */}
            <div className="flex rounded-full border border-(--retro-cream)/15 bg-(--retro-dark)/60 p-1 font-(family-name:--font-dm-sans) text-xs uppercase tracking-[0.2em]">
              <button
                type="button"
                onClick={() => switchMode("login")}
                className={`flex-1 rounded-full px-4 py-2 transition-all duration-200 ${
                  mode === "login"
                    ? "bg-(--retro-terracota) text-white shadow-md"
                    : "text-(--retro-paper)/50 hover:text-(--retro-paper)/80"
                }`}
              >
                Iniciar sesión
              </button>
              <button
                type="button"
                onClick={() => switchMode("register")}
                className={`flex-1 rounded-full px-4 py-2 transition-all duration-200 ${
                  mode === "register"
                    ? "bg-(--retro-terracota) text-white shadow-md"
                    : "text-(--retro-paper)/50 hover:text-(--retro-paper)/80"
                }`}
              >
                Crear cuenta
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-7 space-y-4">

              {mode === "register" && (
                <div>
                  <label className="block font-(family-name:--font-dm-sans) text-[10px] uppercase tracking-[0.25em] text-(--retro-paper)/60">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="mt-2 w-full border border-(--retro-paper)/20 bg-(--retro-dark)/70 px-4 py-3 font-(family-name:--font-dm-sans) text-sm text-(--retro-cream) placeholder:text-(--retro-paper)/30 focus:border-(--retro-terracota) focus:outline-none focus:ring-1 focus:ring-(--retro-terracota)/50 transition-colors"
                    placeholder="Tu nombre"
                  />
                </div>
              )}

              <div>
                <label className="block font-(family-name:--font-dm-sans) text-[10px] uppercase tracking-[0.25em] text-(--retro-paper)/60">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full border border-(--retro-paper)/20 bg-(--retro-dark)/70 px-4 py-3 font-(family-name:--font-dm-sans) text-sm text-(--retro-cream) placeholder:text-(--retro-paper)/30 focus:border-(--retro-terracota) focus:outline-none focus:ring-1 focus:ring-(--retro-terracota)/50 transition-colors"
                  placeholder="tucorreo@ejemplo.com"
                />
              </div>

              <div>
                <label className="block font-(family-name:--font-dm-sans) text-[10px] uppercase tracking-[0.25em] text-(--retro-paper)/60">
                  Contraseña
                </label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full border border-(--retro-paper)/20 bg-(--retro-dark)/70 px-4 py-3 font-(family-name:--font-dm-sans) text-sm text-(--retro-cream) placeholder:text-(--retro-paper)/30 focus:border-(--retro-terracota) focus:outline-none focus:ring-1 focus:ring-(--retro-terracota)/50 transition-colors"
                  placeholder={mode === "register" ? "Mínimo 8 caracteres" : "Tu contraseña"}
                />
              </div>

              {mode === "register" && (
                <>
                  <div className="pt-1">
                    <div className="flex items-center gap-3">
                      <div className="h-px flex-1 bg-(--retro-cream)/8" />
                      <span className="font-(family-name:--font-dm-sans) text-[10px] uppercase tracking-[0.2em] text-(--retro-paper)/30">
                        Envío
                      </span>
                      <div className="h-px flex-1 bg-(--retro-cream)/8" />
                    </div>
                  </div>

                  <div>
                    <label className="block font-(family-name:--font-dm-sans) text-[10px] uppercase tracking-[0.25em] text-(--retro-paper)/60">
                      Dirección
                    </label>
                    <input
                      type="text"
                      name="addressLine1"
                      value={form.addressLine1}
                      onChange={handleChange}
                      className="mt-2 w-full border border-(--retro-paper)/20 bg-(--retro-dark)/70 px-4 py-3 font-(family-name:--font-dm-sans) text-sm text-(--retro-cream) placeholder:text-(--retro-paper)/30 focus:border-(--retro-terracota) focus:outline-none focus:ring-1 focus:ring-(--retro-terracota)/50 transition-colors"
                      placeholder="Calle y número"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-(family-name:--font-dm-sans) text-[10px] uppercase tracking-[0.25em] text-(--retro-paper)/60">
                        Ciudad
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        className="mt-2 w-full border border-(--retro-paper)/20 bg-(--retro-dark)/70 px-4 py-3 font-(family-name:--font-dm-sans) text-sm text-(--retro-cream) placeholder:text-(--retro-paper)/30 focus:border-(--retro-terracota) focus:outline-none focus:ring-1 focus:ring-(--retro-terracota)/50 transition-colors"
                        placeholder="Ciudad"
                      />
                    </div>
                    <div>
                      <label className="block font-(family-name:--font-dm-sans) text-[10px] uppercase tracking-[0.25em] text-(--retro-paper)/60">
                        País
                      </label>
                      <input
                        type="text"
                        name="country"
                        value={form.country}
                        onChange={handleChange}
                        className="mt-2 w-full border border-(--retro-paper)/20 bg-(--retro-dark)/70 px-4 py-3 font-(family-name:--font-dm-sans) text-sm text-(--retro-cream) placeholder:text-(--retro-paper)/30 focus:border-(--retro-terracota) focus:outline-none focus:ring-1 focus:ring-(--retro-terracota)/50 transition-colors"
                        placeholder="País"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-(--retro-terracota) px-6 py-4 font-(family-name:--font-dm-sans) text-xs font-medium uppercase tracking-[0.25em] text-white transition-colors hover:bg-(--retro-rust)"
                >
                  {mode === "login" ? "Continuar →" : "Crear cuenta →"}
                </button>
              </div>

              {mode === "login" && (
                <p className="text-center font-(family-name:--font-dm-sans) text-[11px] text-(--retro-paper)/40 transition-colors hover:text-(--retro-paper)/60 cursor-pointer">
                  ¿Olvidaste tu contraseña?
                </p>
              )}

              <p className="pt-1 text-center font-(family-name:--font-dm-sans) text-[10px] uppercase tracking-[0.2em] text-(--retro-paper)/30">
                Sin backend aún — estado local del navegador
              </p>
            </form>
          </div>

          {/* Bottom note */}
          <p className="mt-6 text-center font-(family-name:--font-body) text-sm italic text-(--retro-paper)/30">
            "La moda pasa, el estilo permanece."
          </p>
        </div>
      </section>
    </div>
  );
}
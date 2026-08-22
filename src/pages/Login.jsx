import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import DayBars from "../components/DayBars";
import "./Login.css";

export default function Login() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [mode, setMode] = useState(params.get("mode") === "signup" ? "signup" : "signin");
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  return (
    <div className="auth">
      <aside className="auth__rail">
        <Link to="/" className="auth__brand">
          <span className="nav__mark" aria-hidden="true" />
          <span className="mono">DayFlow</span>
        </Link>

        <div className="auth__rail-mid">
          <DayBars size="sm" animated={false} />
          <h2>Every workday, perfectly aligned.</h2>
          <p>
            One sign-in for attendance, leave and payroll — the same
            record for you and for HR.
          </p>
        </div>

        <p className="auth__rail-foot mono">HRMS · 22ISE442</p>
      </aside>

      <main className="auth__panel">
        <div className="auth__card">
          <div className="auth__tabs" role="tablist" aria-label="Sign in or register">
            <button
              role="tab"
              aria-selected={mode === "signin"}
              className={mode === "signin" ? "is-active" : ""}
              onClick={() => setMode("signin")}
            >
              Sign in
            </button>
            <button
              role="tab"
              aria-selected={mode === "signup"}
              className={mode === "signup" ? "is-active" : ""}
              onClick={() => setMode("signup")}
            >
              Register company
            </button>
          </div>

          {mode === "signin" ? (
            <form
              className="auth__form"
              onSubmit={(e) => {
                e.preventDefault();
                navigate("/dashboard");
              }}
            >
              <h1>Welcome back</h1>
              <p className="auth__hint">
                Sign in with the login ID or email your HR admin gave you.
              </p>

              <label className="field">
                <span>Login ID or email</span>
                <input type="text" placeholder="OIJODO20220001 or you@company.com" autoComplete="username" />
              </label>

              <label className="field">
                <span>Password</span>
                <div className="field__input-wrap">
                  <input type={showPw ? "text" : "password"} placeholder="••••••••" autoComplete="current-password" />
                  <button
                    type="button"
                    className="field__toggle"
                    onClick={() => setShowPw((v) => !v)}
                    aria-label={showPw ? "Hide password" : "Show password"}
                  >
                    {showPw ? "Hide" : "Show"}
                  </button>
                </div>
              </label>

              <div className="auth__row">
                <label className="checkbox">
                  <input type="checkbox" />
                  <span>Keep me signed in</span>
                </label>
                <a href="#reset" className="auth__link">Forgot password?</a>
              </div>

              <button type="submit" className="btn btn--primary btn--full">
                Sign in
              </button>

              <p className="auth__switch">
                New here? Your account is created by your HR admin —{" "}
                <button type="button" className="linklike" onClick={() => setMode("signup")}>
                  register your company instead
                </button>
              </p>
            </form>
          ) : (
            <form className="auth__form" onSubmit={(e) => e.preventDefault()}>
              <h1>Register your company</h1>
              <p className="auth__hint">
                This creates the first Admin account. Employee IDs are issued
                automatically after this.
              </p>

              <label className="field field--upload">
                <span>Company name</span>
                <div className="field__row">
                  <input type="text" placeholder="Odoo India" />
                  <button type="button" className="upload-btn" aria-label="Upload company logo">⇧</button>
                </div>
              </label>

              <label className="field">
                <span>Your name</span>
                <input type="text" placeholder="Full name" autoComplete="name" />
              </label>

              <div className="auth__grid2">
                <label className="field">
                  <span>Email</span>
                  <input type="email" placeholder="you@company.com" autoComplete="email" />
                </label>
                <label className="field">
                  <span>Phone</span>
                  <input type="tel" placeholder="+91 9876543210" autoComplete="tel" />
                </label>
              </div>

              <div className="auth__grid2">
                <label className="field">
                  <span>Password</span>
                  <div className="field__input-wrap">
                    <input type={showPw ? "text" : "password"} placeholder="••••••••" autoComplete="new-password" />
                    <button
                      type="button"
                      className="field__toggle"
                      onClick={() => setShowPw((v) => !v)}
                      aria-label={showPw ? "Hide password" : "Show password"}
                    >
                      {showPw ? "Hide" : "Show"}
                    </button>
                  </div>
                </label>
                <label className="field">
                  <span>Confirm password</span>
                  <div className="field__input-wrap">
                    <input type={showConfirmPw ? "text" : "password"} placeholder="••••••••" autoComplete="new-password" />
                    <button
                      type="button"
                      className="field__toggle"
                      onClick={() => setShowConfirmPw((v) => !v)}
                      aria-label={showConfirmPw ? "Hide password" : "Show password"}
                    >
                      {showConfirmPw ? "Hide" : "Show"}
                    </button>
                  </div>
                </label>
              </div>

              <button type="submit" className="btn btn--primary btn--full">
                Create company account
              </button>

              <p className="auth__switch">
                Already registered?{" "}
                <button type="button" className="linklike" onClick={() => setMode("signin")}>
                  Sign in
                </button>
              </p>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}

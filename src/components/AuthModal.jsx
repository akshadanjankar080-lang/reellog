import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function AuthModal({ onClose }) {
  const [tab, setTab] = useState("signin");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  async function handleAuth() {
    setErr(""); setMsg(""); setLoading(true);
    try {
      if (tab === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password: pass, options: { data: { name } } });
        if (error) throw error;
        setMsg("Check your email to confirm your account!");
      }
    } catch (e) { setErr(e.message); }
    setLoading(false);
  }

  return (
    <div className="backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="auth-modal">
        <div className="auth-logo">Reel<span>log</span></div>
        <div className="auth-sub">{tab === "signin" ? "Welcome back!" : "Create your free account"}</div>
        <div className="auth-tabs">
          <button className={`auth-tab${tab === "signin" ? " on" : ""}`}
            onClick={() => { setTab("signin"); setErr(""); setMsg(""); }}>Sign in</button>
          <button className={`auth-tab${tab === "signup" ? " on" : ""}`}
            onClick={() => { setTab("signup"); setErr(""); setMsg(""); }}>Sign up</button>
        </div>
        {err && <div className="auth-err">{err}</div>}
        {msg && <div className="auth-msg">{msg}</div>}
        {tab === "signup" && (
          <input className="auth-inp" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} />
        )}
        <input className="auth-inp" placeholder="Email address" type="email" value={email} onChange={e => setEmail(e.target.value)} />
        <input className="auth-inp" placeholder="Password" type="password" value={pass} onChange={e => setPass(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleAuth()} />
        <button className="auth-btn" onClick={handleAuth} disabled={loading}>
          {loading ? "Loading..." : tab === "signin" ? "Sign in →" : "Create account →"}
        </button>
      </div>
    </div>
  );
}

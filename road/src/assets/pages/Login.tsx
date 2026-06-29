export default function Login() {
  return (
    <div className="login-page">
      <div className="login-left">
        <div>
          <h2 className="login-brand-title">Maharashtra Road Registration Portal</h2>

          <p className="login-brand-subtitle">
            A secure and unified GIS-integrated enterprise SaaS dashboard
            for registration and administrative oversight.
          </p>
        </div>

        <p className="login-copyright">© Government of Maharashtra</p>
      </div>

      <div className="login-right">
        <div className="login-card">
          <h2 className="login-card-title">Account Login</h2>

          <div className="login-field">
            <label className="login-label">Username</label>

            <input
              className="login-input"
              placeholder="admin_pune"
            />
          </div>

          <div className="login-field">
            <label className="login-label">Password</label>

            <input
              type="password"
              className="login-input"
            />
          </div>

          <button className="login-button">
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
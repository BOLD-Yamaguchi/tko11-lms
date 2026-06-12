import { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    console.log(data);

    setTimeout(() => {
      setIsSubmitting(false);
      alert("ログイン成功");
      navigate("/home");
    }, 1000);
  };

  const onNavigateToSignup = () => {
    window.location.href = "/signup";
  };

  return (
    <div className="login-container">
      {/* ヘッダー */}
      <header
        style={{
          backgroundColor: "#2C5A9C",
          color: "white",
          padding: "12px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2 style={{ margin: 0 }}>
          書籍貸出管理システム
        </h2>

        <span>ようこそ</span>
      </header>

      {/* メイン */}
      <div className="login-main">
        <div className="login-card">
          <h2 className="login-title">
            ログイン
          </h2>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* メールアドレス */}
            <div className="form-group">
              <label className="form-group-label">
                ユーザーID（メールアドレス）
              </label>

              <input className="login-input"
                type="email"
                placeholder="sample@example.com"
                {...register("email", {
                  required:
                    "メールアドレスを入力してください",
                })}/>

              {errors.email && (
                <p className="error-message">
                  {errors.email && (
                    <p className="error-message">
                      {String(errors.email.message)}
                    </p>
                  )}
                </p>
              )}
            </div>

            {/* パスワード */}
            <div className="form-group">
              <label className="form-group-label">
                パスワード
              </label>

              <div className="password-wrapper">
                <input className="password-input"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="********"
                  {...register("password", {
                    required:
                      "パスワードを入力してください",
                  })}/>

                <button className="password-toggle"
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }>
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>

              {errors.password && (
                <p className="error-message">
                  {errors.password && (
                    <p className="error-message">
                      {String(errors.password.message)}
                    </p>
                  )}
                </p>
              )}
            </div>

            {/* ログインボタン */}
            <button className="login-button"
              type="submit"
              disabled={isSubmitting}>
              {isSubmitting
                ? "ログイン中..."
                : "ログインする"}
            </button>
          </form>

          {/* 下部リンク */}
          <div className="login-links">
            <p>
              アカウントをお持ちでない方は
              <button className="link-button"
                type="button"
                onClick={
                  onNavigateToSignup
                }>
                新規ユーザー登録
              </button>
            </p>

            <p>
              <button className="link-button"
                type="button"
                onClick={() => navigate("/passwordReset")}>
                パスワードを忘れた方
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
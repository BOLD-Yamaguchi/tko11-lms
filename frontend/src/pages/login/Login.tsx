import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { loginSchema } from "../../schemas/loginSchema";
import type { LoginFormValues } from "../../schemas/loginSchema";
import "./Login.css";
import Header from "../../components/Header";
import { UserRole } from '../../types'

type LoginProps = {
  onLogin: (role: UserRole) => void
}

function Login({ onLogin }: LoginProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setIsSubmitting(true);

      const response = await fetch("http://localhost:8081/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employeeCode: data.employeeCode,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        sessionStorage.setItem("adminKbn", String(result.adminKbn));
        sessionStorage.setItem("employeeCode", result.employeeCode);
        sessionStorage.setItem("username", result.username);

        onLogin(Number(result.adminKbn) as UserRole);

        alert("ログイン成功");

        navigate("/home");
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error(error);
      alert("サーバーとの通信に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <Header
        title="書籍貸出管理システム"
        eyebrow="BOOK MANAGEMENT SYSTEM"
        menuItems={[]}
        showMenu={false}
      />

      <div className="login-main">
        <div className="login-card">
          <h2 className="login-title">ログイン</h2>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label className="form-group-label">社員コード</label>
              <input 
                className="login-input"
                type="text"
                placeholder="社員コードを入力してください"
                {...register("employeeCode")} 
              />
              {errors.employeeCode && (
                <p className="error-message">
                  {String(errors.employeeCode.message)}
                </p>
              )}
            </div>

            <div className="form-group">
              <label className="form-group-label">パスワード</label>
              <div className="password-wrapper">
                <input 
                  className="password-input"
                  type={showPassword ? "text" : "password"}
                  placeholder="********"
                  {...register("password")} 
                />
                <button 
                  className="password-toggle"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="error-message">
                  {String(errors.password.message)}
                </p>
              )}
            </div>

            <button className="login-button" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "ログイン中..." : "ログインする"}
            </button>
          </form>

          <div className="login-links">
            <p>
              アカウントをお持ちでない方は
              <button className="link-button" type="button" onClick={() => navigate("/user-create")}>
                新規ユーザー登録
              </button>
            </p>
            <p>
              <button className="link-button" type="button" onClick={() => navigate("/passwordReset")}>
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
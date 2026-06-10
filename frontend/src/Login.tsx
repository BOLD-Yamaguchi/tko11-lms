import { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
      navigate("/UsersList");
    }, 1000);
  };

  const onNavigateToSignup = () => {
    window.location.href = "/signup";
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#E8E8E8",
        display: "flex",
        flexDirection: "column",
      }}
    >
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
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "30px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "480px",
            backgroundColor: "#FFFFFF",
            borderRadius: "10px",
            boxShadow:
              "0 2px 8px rgba(0,0,0,0.15)",
            padding: "40px",
          }}
        >
          <h2
            style={{
              textAlign: "center",
              marginBottom: "30px",
              color: "black"
            }}
          >
            ログイン
          </h2>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* メールアドレス */}
            <div
              style={{
                marginBottom: "20px",
                textAlign: "left",
              }}
            >
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  color: "black"
                }}
              >
                ユーザーID（メールアドレス）
              </label>

              <input
                type="email"
                placeholder="sample@example.com"
                {...register("email", {
                  required:
                    "メールアドレスを入力してください",
                })}
                style={{
                  width: "100%",
                  padding: "10px",
                  border:
                    "1px solid #CCCCCC",
                  borderRadius: "5px",
                  boxSizing: "border-box",
                }}
              />

              {errors.email && (
                <p
                  style={{
                    color: "red",
                    fontSize: "12px",
                    marginTop: "5px",
                  }}>
                  {errors.email && (
                    <p
                      style={{
                        color: "red",
                        fontSize: "12px",
                        marginTop: "5px",
                      }}>
                      {String(errors.email.message)}
                    </p>
                  )}
                </p>
              )}
            </div>

            {/* パスワード */}
            <div
              style={{
                marginBottom: "25px",
                textAlign: "left",
              }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  color: "black"
                }}
              >
                パスワード
              </label>

              <div
                style={{
                  position: "relative",
                }}
              >
                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="********"
                  {...register("password", {
                    required:
                      "パスワードを入力してください",
                  })}
                  style={{
                    width: "100%",
                    padding: "10px",
                    paddingRight: "40px",
                    border:
                      "1px solid #CCCCCC",
                    borderRadius: "5px",
                    boxSizing: "border-box",
                  }}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform:
                      "translateY(-50%)",
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                  }}
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>

              {errors.password && (
                <p
                  style={{
                    color: "red",
                    fontSize: "12px",
                    marginTop: "5px",
                  }}>
                  {errors.password && (
                    <p
                      style={{
                        color: "red",
                        fontSize: "12px",
                        marginTop: "5px",
                      }}
                    >
                      {String(errors.password.message)}
                    </p>
                  )}
                </p>
              )}
            </div>

            {/* ログインボタン */}
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: "#4285F4",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "16px",
              }}>
              {isSubmitting
                ? "ログイン中..."
                : "ログインする"}
            </button>
          </form>

          {/* 下部リンク */}
          <div
            style={{
              marginTop: "25px",
              textAlign: "center",
              fontSize: "14px",
            }}>
            <p>
              アカウントをお持ちでない方は
              <button
                type="button"
                onClick={
                  onNavigateToSignup
                }
                style={{
                  border: "none",
                  background: "none",
                  color: "#4285F4",
                  cursor: "pointer",
                  marginLeft: "5px",
                }}>
                新規ユーザー登録
              </button>
            </p>

            <p>
              <button
                type="button"
                style={{
                  border: "none",
                  background: "none",
                  color: "#4285F4",
                  cursor: "pointer",
                }}>
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
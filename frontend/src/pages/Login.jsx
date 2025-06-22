import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { authAPI, setAuthToken } from "../utils/auth";
import { useToast } from "../components/ui/toast";

const Login = () => {
  const currentYear = new Date().getFullYear();
  
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { success, error } = useToast();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authAPI.login(formData);
      setAuthToken(response.token || response.access_token);
      success("تم تسجيل الدخول بنجاح", "مرحباً بك");
      navigate("/dashboard");
    } catch (err) {
      error(err.message, "خطأ في تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white flex flex-row justify-center w-full">
      <div className="bg-white w-full max-w-[1440px] h-[900px] relative">
        {/* Right side with background and promotional content */}
        <Card className="absolute w-[720px] h-[860px] top-5 left-auto right-5 rounded-[20px] border-0">
          <CardContent className="p-0 h-full">
            <div className="relative h-full rounded-[20px] overflow-hidden">
              {/* Background blur effects */}
              <div className="absolute w-[720px] h-[861px] top-0 left-0 rounded-[20px] overflow-hidden">
                <div className="top-[765px] left-0 absolute w-[379px] h-[379px] bg-[#2d55fb] rounded-[189.5px] blur-[275px]" />
                <div className="top-[-136px] left-[585px] absolute w-[379px] h-[379px] bg-[#2d55fb] rounded-[189.5px] blur-[275px]" />
              </div>

              {/* Main image */}
              <img
                className="absolute w-[360px] h-96 top-[107px] left-[190px] object-cover"
                alt="Reduce only"
                src="/reduce-only.png"
              />

              {/* Logo */}
              <div className="absolute w-10 h-10 top-[52px] right-[28px]">
                <img
                  className="w-10 h-[38px]"
                  alt="WeighPro Logo"
                  src="/group-3573.png"
                />
              </div>

              {/* Promotional text */}
              <div className="absolute w-[400px] h-[205px] top-[548px] left-[270px]">
                {/* Navigation dots */}
                <div className="inline-flex items-center gap-3 absolute top-0 left-[278px]">
                  <div className="relative w-8 h-[5px] bg-[#f1eff74c] rounded-lg" />
                  <div className="relative w-8 h-[5px] bg-[#f1eff74c] rounded-lg" />
                  <div className="w-8 h-[5px] relative bg-indigo-500 rounded-lg" />
                </div>

                <div className="flex flex-col w-[400px] items-start gap-6 absolute top-[37px] left-0">
                  <div className="flex flex-col items-center justify-center gap-8 relative self-stretch w-full">
                    <div className="flex flex-col items-end gap-4 relative self-stretch w-full">
                      <div className="relative w-fit ml-[-68.00px] [font-family:'Rubik',Helvetica] font-bold text-white text-[28px] tracking-[0] leading-[42px] [direction:rtl]">
                        مرحبا بكم في WeighPro – ذكاء متكامل
                        <br />
                        في الوزن الصناعي!
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center gap-8 relative self-stretch w-full">
                    <div className="flex flex-col items-end gap-4 relative self-stretch w-full">
                      <div className="w-[558px] ml-[-158.00px] font-normal text-[#f7faffe6] text-xl leading-[30px] relative [font-family:'Rubik',Helvetica] tracking-[0] [direction:rtl]">
                        منصة متطورة لتحقيق أعلى كفاءة في الوزن، دقة البيانات، و
                        تجربة سهلة لمشغلي الموازين ومديري الأساطيل لجميع الأحجام
                        والقطاعات!
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Left side with login form */}
        <Card className="flex flex-col w-[400px] items-center justify-center gap-8 absolute top-[259px] left-[146px] rounded-[10px] border-0 bg-transparent shadow-none">
          <CardContent className="p-0 w-full">
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col items-end gap-4 relative self-stretch w-full mb-8">
                <div className="w-fit font-bold text-[#121212] text-[28px] text-left leading-7 whitespace-nowrap [font-family:'Rubik',Helvetica] tracking-[0] [direction:rtl]">
                  تسجيل الدخول
                </div>
              </div>

              <div className="flex flex-col items-start gap-6 relative self-stretch w-full mb-8">
                {/* Email field */}
                <div className="flex flex-col items-end gap-3 relative self-stretch w-full">
                  <div className="flex items-start justify-end gap-3 relative self-stretch w-full">
                    <div className="relative flex-1 [font-family:'Rubik',Helvetica] font-normal text-[#2d2d2d] text-base tracking-[0] leading-4 [direction:rtl]">
                      البريد الالكتروني
                    </div>
                  </div>

                  <div className="flex h-12 items-start justify-end gap-2 relative self-stretch w-full">
                    <Input
                      className="flex items-center justify-end gap-[5px] px-4 py-3 text-right h-12 border-[#5e5adb]"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="أدخل البريد الإلكتروني"
                      dir="rtl"
                      required
                    />
                  </div>
                </div>

                {/* Password field */}
                <div className="flex flex-col items-start gap-3 relative self-stretch w-full">
                  <div className="flex items-start justify-end relative self-stretch w-full">
                    <div className="relative flex-1 [font-family:'Rubik',Helvetica] font-normal text-[#2d2d2d] text-base tracking-[0] leading-4 [direction:rtl]">
                      كلمه المرور
                    </div>
                  </div>

                  <div className="flex flex-col items-start gap-2 relative self-stretch w-full">
                    <div className="flex items-center gap-[5px] relative self-stretch w-full rounded-lg border border-solid border-[#dee2e9]">
                      <Input
                        className="border-0 shadow-none px-4 py-3 text-right h-12 placeholder:text-[#8d96af]"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="أدخل كلمة المرور"
                        dir="rtl"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute left-4 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? (
                          <EyeOffIcon className="w-6 h-6" />
                        ) : (
                          <EyeIcon className="w-6 h-6" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center gap-6 relative self-stretch w-full">
                {/* Login button */}
                <Button 
                  type="submit"
                  disabled={loading}
                  className="flex h-12 items-center justify-center gap-[5px] p-4 self-stretch w-full bg-indigo-500 rounded-lg hover:bg-indigo-600 disabled:opacity-50"
                >
                  <div className="w-fit font-semibold text-white text-base text-left leading-4 whitespace-nowrap [font-family:'Rubik',Helvetica] tracking-[0] [direction:rtl]">
                    {loading ? "جاري تسجيل الدخول..." : "دخول"}
                  </div>
                </Button>

                {/* Registration prompt */}
                <div className="inline-flex items-start gap-2 relative">
                  <Link 
                    to="/signup"
                    className="w-fit font-normal text-indigo-500 text-base text-left leading-4 whitespace-nowrap [font-family:'Rubik',Helvetica] tracking-[0] [direction:rtl] cursor-pointer hover:underline"
                  >
                    سجل الأن
                  </Link>

                  <div className="w-fit font-normal text-[#8d96af] text-base text-left leading-4 whitespace-nowrap [font-family:'Rubik',Helvetica] tracking-[0] [direction:rtl]">
                    ليس لديك حساب؟
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="absolute top-[847px] left-[167px] h-4 text-base leading-4 whitespace-nowrap [direction:rtl] [font-family:'Rubik',Helvetica] text-[#575757]">
          <span>
            © {currentYear} جميع الحقوق محفوظة لشركة{" "}
          </span>
          <a
            href="https://www.m-iit.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#5e5adb] hover:underline"
          >
            Millennium
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;

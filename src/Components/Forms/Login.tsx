import {
  Check,
  Visibility,
  VisibilityOff,
  Google,
  Apple,
  GitHub,
} from "@mui/icons-material";
import {
  Button,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  InputLabel,
  TextField,
  styled,
} from "@mui/material";
import { Formik, Form } from "formik";
import Link from "next/link";
import React, { useState } from "react";
import * as Yup from "yup";

const initiationValues = {
  email: "",
  password: "",
};

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid Email Address")
    .required("Email is required"),
  password: Yup.string()
    .matches(
      /^(?=.*[!@#$%^&*()-_=+{};:,<.>])(?=.*\d).{8,}$/,
      "Invalid password it must contain 8 character and a special character, a number"
    )
    .required("Password is required"),
});
const Login = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const Root = styled("div")(({ theme }) => ({
    width: "100%",
    ...theme.typography.body2,
    color: theme.palette.text.secondary,
    "& > :not(style) ~ :not(style)": {
      marginTop: theme.spacing(2),
    },
  }));

  // handle submit
  const handleSubmit = () => {};
  return (
    <main className="sm:w-1/2 md:1/3 lg:w-1/4 w-1/4">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Login To Your Account</h1>
      </div>
      <Formik
        initialValues={initiationValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          setFieldValue,
        }) => (
          <Form>
            {/* main two form */}
            <div className="flex flex-col gap-3 mt-5">
              <div>
                <InputLabel>Email</InputLabel>
                <TextField
                  type="text"
                  name="email"
                  id="email"
                  placeholder="Email"
                  size="small"
                  fullWidth
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.email && !!errors.email}
                  helperText={
                    Boolean(touched.email) && (errors.email as string)
                  }
                />
              </div>
              <div>
                <InputLabel>Password</InputLabel>
                <TextField
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  placeholder="Password"
                  size="small"
                  fullWidth
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.password && !!errors.password}
                  helperText={
                    Boolean(touched.password) && (errors.password as string)
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {"password" === "password" && (
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        )}
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
            </div>

            {/* forgot password */}

            <div className="flex justify-end mt-4 cursor-pointer">
              <Link href="/Forgot_Password">
                <p className=" text-sm font-semibold text-blue-500">
                  Forgot Password?
                </p>
              </Link>
            </div>

            {/* button submit */}
            <div className="mt-2">
              <Button
                type="submit"
                variant="contained"
                className="w-full px-8 py-2 font-semibold rounded-md bg-blue-500 text-center"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <Check />}
              >
                Login
              </Button>
            </div>
          </Form>
        )}
      </Formik>
      {/* social media  */}
      <div className="mt-3">
        <Root>
          <Divider>or continue with</Divider>
        </Root>

        {/* login with social */}
        <div className="flex items-center justify-center gap-5 mt-4">
          <div className="bg-black p-[0.5rem] rounded-full">
            <Google
              style={{ fontSize: 25 }}
              className="cursor-pointer text-white"
            />
          </div>
          <div className="bg-black p-2 rounded-full text-center mt-[0.2rem]">
            <Apple
              style={{ fontSize: 25 }}
              className="cursor-pointer text-white"
            />
          </div>
          <div className="bg-black p-2 rounded-full text-center mt-[0.2rem]">
            <GitHub
              style={{ fontSize: 25 }}
              className="cursor-pointer text-white"
            />
          </div>
        </div>
        <div className="flex gap-1 items-center justify-center mt-5 text-sm">
          <p>Don&apos;t have account?</p>
          <Link href="/Register">
            <p className="font-semibold text-blue-500">Create</p>
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Login;

import { object, ref, string } from "yup";

export const registerSchema = object({
  firstName: string().required("Enter your Firstname"),
  lastName: string().required("Enter you Lastname"),
  email: string().email("email invalid").required("Email is required"),
  password: string().min(6).required("Password minimum is 6 char"),
  confirmPassword: string().oneOf([ref("password"), null]).required("confirmpassword is requird"),
  phone : string().required("Enter you Phone number"),
  address: string().required("Enter you address"),
});
export const loginschema = object({
   email: string().email("email invalid").required("Email is required"),
  password: string().min(6).required("Password minimum is 6 char"),
})

export const validate = (schema) => async (req, res, next) => {
  try {
    await schema.validate(req.body, { abortEarly: false });
    next();
  } catch (error) {
    const errMsg = error.errors.map((item) => item);
    const errTxt = errMsg.join(",");
    const mereErr = new Error(errTxt);
    next(mereErr);
  }
};

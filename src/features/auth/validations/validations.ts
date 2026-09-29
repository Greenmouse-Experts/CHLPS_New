import * as Yup from "yup";

export class AuthValidations {
  static loginValidationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  static registerValidationSchema = Yup.object().shape({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    phone: Yup.string().required("Phone number is required"),
    placeOfWork: Yup.string().required("Place of work is required"),
    officialDesignation: Yup.string().required(
      "Official designation is required",
    ),
    currentEducationOrProfessionalQualification: Yup.string().required(
      "Current education or qualification is required",
    ),
    country: Yup.string().required("Country is required"),
    stateProvince: Yup.string().required("State / Province is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Please confirm your password"),
    agree: Yup.boolean().oneOf([true], "You must agree to continue"),
  });

  static resetPasswordValidationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
  });
}

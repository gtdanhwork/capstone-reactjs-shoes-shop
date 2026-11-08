import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { userService } from '../services/userService';

const Register = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const signupSchema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    passwordConfirm: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm password is required'),
    name: Yup.string()
      .matches(/^[a-zA-ZÀ-ỹ\s]+$/, 'Name can only contain letters and spaces')
      .required('Name is required'),
    phone: Yup.string()
      .matches(/^[0-9]+$/, 'Phone number must contain only numbers')
      .min(9, 'Phone number must be at least 9 digits')
      .required('Phone is required'),
    gender: Yup.boolean().required('Please select a gender'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      passwordConfirm: '',
      name: '',
      phone: '',
      gender: true,
    },
    validationSchema: signupSchema,
    onSubmit: async (values) => {
      setServerError('');
      setSuccessMsg('');

      try {
        const payload = {
          email: values.email,
          password: values.password,
          name: values.name,
          phone: values.phone,
          gender: values.gender,
        };

        await userService.signup(payload);
        setSuccessMsg('Registration successful! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } catch (err) {
        setServerError(err.response?.data?.message || 'Registration failed. Please try again.');
      }
    },
  });

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-sm border-0 p-4 bg-light">
            {/* Top Navigation Row with Return Button */}
            <div className="d-flex align-items-center justify-content-between mb-4">
              <button 
                type="button" 
                className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
                onClick={() => navigate(-1)}
              >
                <i className="bi bi-arrow-left"></i> Back
              </button>
              <h2 className="fw-bold m-0">Register</h2>
              <div style={{ width: '60px' }}></div> {/* Spacer to center heading */}
            </div>

            {serverError && <div className="alert alert-danger">{serverError}</div>}
            {successMsg && <div className="alert alert-success">{successMsg}</div>}

            <form onSubmit={formik.handleSubmit}>
              {/* Email */}
              <div className="mb-3">
                <label className="form-label fw-bold">Email</label>
                <input
                  type="email"
                  name="email"
                  className={`form-control ${formik.touched.email && formik.errors.email ? 'is-invalid' : ''}`}
                  placeholder="Enter email"
                  {...formik.getFieldProps('email')}
                />
                {formik.touched.email && formik.errors.email && (
                  <div className="invalid-feedback">{formik.errors.email}</div>
                )}
              </div>

              {/* Password */}
              <div className="mb-3">
                <label className="form-label fw-bold">Password</label>
                <input
                  type="password"
                  name="password"
                  className={`form-control ${formik.touched.password && formik.errors.password ? 'is-invalid' : ''}`}
                  placeholder="Enter password"
                  {...formik.getFieldProps('password')}
                />
                {formik.touched.password && formik.errors.password && (
                  <div className="invalid-feedback">{formik.errors.password}</div>
                )}
              </div>

              {/* Password Confirm */}
              <div className="mb-3">
                <label className="form-label fw-bold">Password confirm</label>
                <input
                  type="password"
                  name="passwordConfirm"
                  className={`form-control ${formik.touched.passwordConfirm && formik.errors.passwordConfirm ? 'is-invalid' : ''}`}
                  placeholder="Confirm password"
                  {...formik.getFieldProps('passwordConfirm')}
                />
                {formik.touched.passwordConfirm && formik.errors.passwordConfirm && (
                  <div className="invalid-feedback">{formik.errors.passwordConfirm}</div>
                )}
              </div>

              {/* Name */}
              <div className="mb-3">
                <label className="form-label fw-bold">Name</label>
                <input
                  type="text"
                  name="name"
                  className={`form-control ${formik.touched.name && formik.errors.name ? 'is-invalid' : ''}`}
                  placeholder="Enter name (letters and spaces only)"
                  {...formik.getFieldProps('name')}
                />
                {formik.touched.name && formik.errors.name && (
                  <div className="invalid-feedback">{formik.errors.name}</div>
                )}
              </div>

              {/* Phone */}
              <div className="mb-3">
                <label className="form-label fw-bold">Phone</label>
                <input
                  type="text"
                  name="phone"
                  className={`form-control ${formik.touched.phone && formik.errors.phone ? 'is-invalid' : ''}`}
                  placeholder="Enter phone number (numbers only)"
                  {...formik.getFieldProps('phone')}
                />
                {formik.touched.phone && formik.errors.phone && (
                  <div className="invalid-feedback">{formik.errors.phone}</div>
                )}
              </div>

              {/* Gender */}
              <div className="mb-4">
                <label className="form-label fw-bold d-block">Gender</label>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="gender"
                    id="male"
                    value="true"
                    checked={formik.values.gender === true}
                    onChange={() => formik.setFieldValue('gender', true)}
                  />
                  <label className="form-check-label" htmlFor="male">Male</label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="gender"
                    id="female"
                    value="false"
                    checked={formik.values.gender === false}
                    onChange={() => formik.setFieldValue('gender', false)}
                  />
                  <label className="form-check-label" htmlFor="female">Female</label>
                </div>
              </div>

              <button type="submit" className="btn btn-dark w-100 fw-bold py-2">
                SUBMIT
              </button>
            </form>

            <div className="mt-3 text-center">
              <span className="text-muted">Already have an account? </span>
              <Link to="/login" className="fw-bold text-decoration-none">Login here</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
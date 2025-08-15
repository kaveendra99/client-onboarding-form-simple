'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { onboardingSchema, OnboardingFormData } from '@/lib/schemas';
import { useState } from 'react';

const SERVICES = ['UI/UX', 'Branding', 'Web Dev', 'Mobile App'] as const;

export default function OnboardingForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedData, setSubmittedData] = useState<OnboardingFormData | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    mode: 'onTouched',
    defaultValues: {
      budgetUsd: undefined,
    },
  });

  const onSubmit = async (data: OnboardingFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_ONBOARD_URL || 'https://example.com/api/onboard',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fullName: data.fullName,
            email: data.email,
            companyName: data.companyName,
            services: data.services,
            budgetUsd: data.budgetUsd,
            projectStartDate: data.projectStartDate,
            acceptTerms: data.acceptTerms,
          }),
        }
      );

      if (!response.ok) {
        let errorMessage = `HTTP error! Status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          console.error('Failed to parse error response:', e);
        }
        throw new Error(errorMessage);
      }

      setSubmittedData(data);
      setSubmitSuccess(true);
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInputClasses = (hasError: boolean) =>
    `w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
      hasError ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
    }`;

  if (submitSuccess && submittedData) {
    return (
      <div className="max-w-md mx-auto p-6 bg-green-50 border border-green-200 rounded-lg animate-fadeIn">
        <div className="flex items-center text-green-800 mb-4">
          <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <h2 className="text-lg font-medium">Form submitted successfully!</h2>
        </div>
        
        <div className="mt-4 space-y-2 text-sm text-gray-700">
          <p><strong>Name:</strong> {submittedData.fullName}</p>
          <p><strong>Email:</strong> {submittedData.email}</p>
          <p><strong>Company:</strong> {submittedData.companyName}</p>
          <p><strong>Services:</strong> {submittedData.services.join(', ')}</p>
          {submittedData.budgetUsd && <p><strong>Budget:</strong> ${submittedData.budgetUsd.toLocaleString()}</p>}
          <p><strong>Start Date:</strong> {new Date(submittedData.projectStartDate).toLocaleDateString()}</p>
        </div>

        <button
          onClick={() => {
            setSubmitSuccess(false);
            reset();
          }}
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Submit another response
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto space-y-6 p-6 bg-white rounded-lg shadow-md"
      noValidate
    >
      <h1 className="text-2xl font-bold text-gray-800">Client Onboarding</h1>

      {submitError && (
        <div className="p-4 bg-red-50 border-l-4 border-red-400 rounded animate-fadeIn">
          <p className="text-red-600">{submitError}</p>
        </div>
      )}

      {/* Full Name */}
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          id="fullName"
          type="text"
          autoComplete="name"
          {...register('fullName')}
          className={getInputClasses(!!errors.fullName)}
          aria-invalid={!!errors.fullName}
          aria-describedby={errors.fullName ? "fullName-error" : undefined}
        />
        {errors.fullName && (
          <p id="fullName-error" className="mt-2 text-sm text-red-600 animate-fadeIn">
            {errors.fullName.message}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          {...register('email')}
          className={getInputClasses(!!errors.email)}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
        />
        {errors.email && (
          <p id="email-error" className="mt-2 text-sm text-red-600 animate-fadeIn">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Company Name */}
      <div>
        <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
          Company Name <span className="text-red-500">*</span>
        </label>
        <input
          id="companyName"
          type="text"
          autoComplete="organization"
          {...register('companyName')}
          className={getInputClasses(!!errors.companyName)}
          aria-invalid={!!errors.companyName}
          aria-describedby={errors.companyName ? "companyName-error" : undefined}
        />
        {errors.companyName && (
          <p id="companyName-error" className="mt-2 text-sm text-red-600 animate-fadeIn">
            {errors.companyName.message}
          </p>
        )}
      </div>

      {/* Services */}
      <fieldset className={`p-4 border rounded-lg ${
        errors.services ? 'border-red-500 bg-red-50' : 'border-gray-200'
      }`}>
        <legend className="block text-sm font-medium text-gray-700 px-2">
          Services Interested In <span className="text-red-500">*</span>
        </legend>
        <div className="mt-3 space-y-3">
          {SERVICES.map((service) => (
            <div key={service} className="flex items-center">
              <input
                id={`service-${service}`}
                type="checkbox"
                value={service}
                {...register('services')}
                className={`h-4 w-4 rounded ${
                  errors.services ? 'border-red-500 text-red-600' : 'border-gray-300 text-blue-600'
                } focus:ring-blue-500`}
                aria-invalid={!!errors.services}
                aria-describedby={errors.services ? "services-error" : undefined}
              />
              <label htmlFor={`service-${service}`} className="ml-3 text-sm text-gray-700">
                {service}
              </label>
            </div>
          ))}
        </div>
        {errors.services && (
          <p id="services-error" className="mt-2 text-sm text-red-600 animate-fadeIn">
            {errors.services.message}
          </p>
        )}
      </fieldset>

      {/* Budget */}
      <div>
        <label htmlFor="budgetUsd" className="block text-sm font-medium text-gray-700 mb-2">
          Budget (USD)
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500">$</span>
          </div>
          <input
            id="budgetUsd"
            type="number"
            autoComplete="transaction-amount"
            {...register('budgetUsd', { valueAsNumber: true })}
            className={`${getInputClasses(!!errors.budgetUsd)} pl-9`}
            aria-invalid={!!errors.budgetUsd}
            aria-describedby={errors.budgetUsd ? "budgetUsd-error" : undefined}
            placeholder="Optional"
          />
        </div>
        {errors.budgetUsd && (
          <p id="budgetUsd-error" className="mt-2 text-sm text-red-600 animate-fadeIn">
            {errors.budgetUsd.message}
          </p>
        )}
      </div>

      {/* Project Start Date */}
      <div>
        <label htmlFor="projectStartDate" className="block text-sm font-medium text-gray-700 mb-2">
          Project Start Date <span className="text-red-500">*</span>
        </label>
        <input
          id="projectStartDate"
          type="date"
          autoComplete="off"
          {...register('projectStartDate')}
          className={getInputClasses(!!errors.projectStartDate)}
          aria-invalid={!!errors.projectStartDate}
          aria-describedby={errors.projectStartDate ? "projectStartDate-error" : undefined}
          min={new Date().toISOString().split('T')[0]}
        />
        {errors.projectStartDate && (
          <p id="projectStartDate-error" className="mt-2 text-sm text-red-600 animate-fadeIn">
            {errors.projectStartDate.message}
          </p>
        )}
      </div>

      {/* Terms */}
      <div className={`flex items-start p-4 rounded-lg ${
        errors.acceptTerms ? 'bg-red-50' : ''
      }`}>
        <div className="flex items-center h-5">
          <input
            id="acceptTerms"
            type="checkbox"
            {...register('acceptTerms')}
            className={`h-4 w-4 rounded ${
              errors.acceptTerms ? 'border-red-500 text-red-600' : 'border-gray-300 text-blue-600'
            } focus:ring-blue-500`}
            aria-invalid={!!errors.acceptTerms}
            aria-describedby={errors.acceptTerms ? "acceptTerms-error" : undefined}
          />
        </div>
        <div className="ml-3 text-sm">
          <label htmlFor="acceptTerms" className="font-medium text-gray-700">
            Accept Terms and Conditions <span className="text-red-500">*</span>
          </label>
          {errors.acceptTerms && (
            <p id="acceptTerms-error" className="mt-2 text-sm text-red-600 animate-fadeIn">
              {errors.acceptTerms.message}
            </p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${
          isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
        }`}
        aria-disabled={isSubmitting}
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        ) : (
          'Submit Application'
        )}
      </button>
    </form>
  );
}
'use client';
import React, { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import useInstitution from '@/hooks/useInstitution';
import { Link, useRouter } from '@/i18n/routing';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon, Upload } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import * as z from 'zod';

// Define validation schema
const studentSchema = z.object({
  HCJ_ST_InstituteNum: z.string().nonempty('Institution number is required.'),
  HCJ_ST_Institution_Name: z.string().nonempty('Institution name is required.'),
  HCJ_ST_Student_First_Name: z.string().nonempty('First name is required.'),
  HCJ_ST_Student_Last_Name: z.string().nonempty('Last name is required.'),
  HCJ_ST_Educational_Email: z.string().email('Invalid email address.'),
  HCJ_ST_Phone_Number: z.string().nonempty('Phone number is required.'),
  HCJ_ST_Gender: z.string().nonempty('Gender is required.'),
  HCJ_ST_DOB: z.date({
    required_error: 'Date of birth is required.',
  }),
  HCJ_ST_Student_Country: z.string().nonempty('Country is required.'),
  HCJ_ST_Student_Pincode: z.string().nonempty('Pin code is required.'),
  HCJ_ST_Student_State: z.string().nonempty('State is required.'),
  HCJ_ST_Student_City: z.string().nonempty('City is required.'),
  HCJ_ST_Address: z.string().nonempty('Address is required.'),
  HCJ_ST_Enrollment_Year: z
    .string()
    .nonempty('Program Enrolled Year is required.'),
  HCJ_ST_Student_Program_Name: z.string().nonempty('Program Name is required.'),
  HCJ_ST_Score_Grade_Type: z.string().nonempty('Grade/Score is required.'),
  HCJ_ST_Score_Grade: z.string().nonempty('Grade/Score Value is required.'),
  HCJ_ST_Student_Document_Domicile: z
    .string()
    .nonempty('Document domicile is required.'),
  HCJ_ST_Student_Document_Type: z
    .string()
    .nonempty('Document type is required.'),
  HCJ_ST_Student_Document_Number: z
    .string()
    .nonempty('Document number is required.'),
  HCJ_ST_Educational_Alternate_Email: z
    .string()
    .email('Invalid alternate email')
    .optional(),
  HCJ_ST_Alternate_Phone_Number: z.string().optional(),
  HCJ_ST_Class_Of_Year: z.string().nonempty('Class year is required.'),
  HCJ_ST_Student_Branch_Specialization: z
    .string()
    .nonempty('Branch is required.'),
  photo: z.any().optional(),
});

// Specialization data structure
const specializationData = [
  {
    category: 'Engineering and Technology',
    specializations: [
      'Computer Science Engineering (CSE)',
      'Information Technology (IT)',
      'Electronics and Communication Engineering (ECE)',
      'Electrical and Electronics Engineering (EEE)',
      'Mechanical Engineering',
      'Civil Engineering',
      'Chemical Engineering',
      'Biotechnology',
      'Aerospace Engineering',
      'Automobile Engineering',
      'Artificial Intelligence and Machine Learning (AI/ML)',
      'Data Science and Analytics',
      'Robotics and Automation',
      'Environmental Engineering',
      'Petroleum Engineering',
      'Marine Engineering',
      'Mechatronics Engineering',
      'Textile Engineering',
      'Agricultural Engineering',
      'Mining Engineering',
    ],
  },
  {
    category: 'Management and Business Administration',
    specializations: [
      'Finance',
      'Marketing',
      'Human Resource Management (HRM)',
      'Operations and Supply Chain Management',
      'International Business',
      'Business Analytics',
      'Entrepreneurship',
      'Digital Marketing',
      'Healthcare Management',
      'Hospitality and Tourism Management',
    ],
  },
  {
    category: 'Arts, Humanities, and Social Sciences',
    specializations: [
      'Psychology',
      'Sociology',
      'Political Science',
      'History',
      'Geography',
      'Economics',
      'English Literature',
      'Philosophy',
      'International Relations',
      'Social Work',
    ],
  },
  {
    category: 'Science',
    specializations: [
      'Physics',
      'Chemistry',
      'Mathematics',
      'Biology',
      'Biotechnology',
      'Microbiology',
      'Environmental Science',
      'Zoology',
      'Botany',
      'Forensic Science',
      'Data Science',
      'Computational Sciences',
    ],
  },
  {
    category: 'Commerce and Finance',
    specializations: [
      'Accounting and Auditing',
      'Taxation',
      'Financial Management',
      'Investment Banking',
      'Actuarial Science',
      'Business Economics',
      'Banking and Insurance',
      'Corporate Law',
    ],
  },
  {
    category: 'Design and Creative Arts',
    specializations: [
      'Fashion Design',
      'Interior Design',
      'Graphic Design',
      'Animation and Multimedia',
      'Product Design',
      'Industrial Design',
      'Game Design',
      'Fine Arts',
    ],
  },
  {
    category: 'Law',
    specializations: [
      'Corporate Law',
      'Criminal Law',
      'Intellectual Property Law',
      'International Law',
      'Environmental Law',
      'Cyber Law',
    ],
  },
  {
    category: 'Education and Teaching',
    specializations: [
      'Primary and Secondary Education',
      'Special Education',
      'Educational Technology',
      'Curriculum and Instruction',
    ],
  },
  {
    category: 'Medical and Health Sciences',
    specializations: [
      'Medicine (MBBS)',
      'Dental Sciences (BDS)',
      'Ayurveda (BAMS)',
      'Homeopathy (BHMS)',
      'Unani Medicine (BUMS)',
      'Veterinary Science (BVSc)',
      'Nursing',
      'Pharmacy (BPharm)',
      'Physiotherapy',
      'Medical Laboratory Technology',
      'Public Health and Epidemiology',
      'Optometry',
      'Clinical Research',
      'Nutrition and Dietetics',
    ],
  },
  {
    category: 'Other Specialized Fields',
    specializations: [
      'Journalism and Mass Communication',
      'Film and Television Production',
      'Event Management',
      'Sports Management',
      'Aviation and Aeronautics',
      'Ethics and Governance',
      'Renewable Energy',
      'Library and Information Science',
    ],
  },
];

// Helper function to convert to sentence case
const toSentenceCase = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export default function AddStudentPage() {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(studentSchema),
  });

  const router = useRouter();
  // Update the state variables at the top of the component to include countries and program-related states
  const [documentTypes, setDocumentTypes] = useState([]);
  const [stateData, setStateData] = useState('');
  const [cityData, setCityData] = useState('');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [countries, setCountries] = useState([]);
  const [filteredSpecializations, setFilteredSpecializations] =
    useState(specializationData);
  const [selectedProgram, setSelectedProgram] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const { data: session, status } = useSession();
  const companyId = session?.user?.companyId; // or whatever field you use
  const { institutionData, loading, error } = useInstitution(companyId);

  // console.log(session);

  // Update the fetchDocumentDetails function to fetch countries as well
  const fetchDocumentDetails = async (countryCode) => {
    try {
      const response = await fetch('/api/global/v1/gblArET90004FtchDcmntDtls');
      const data = await response.json();

      if (data && data.documentDetails) {
        // Get unique countries from the API response
        const uniqueCountries = [
          ...new Set(
            data.documentDetails.map((doc) => doc.relatedCountry.toLowerCase())
          ),
        ];
        setCountries(uniqueCountries);

        // Filter documents for the selected country
        const countryDocuments = data.documentDetails.filter(
          (doc) =>
            doc.relatedCountry.toLowerCase() === countryCode.toLowerCase()
        );

        if (countryDocuments.length > 0) {
          setDocumentTypes(countryDocuments);
        }

        // Auto-fill the Document Domicile field with the selected country
        setValue(
          'HCJ_ST_Student_Document_Domicile',
          toSentenceCase(countryCode)
        );
      }
    } catch (error) {
      console.error('Error fetching document details:', error);
    }
  };

  // Add useEffect to fetch countries on component mount
  useEffect(() => {
    // Set default country to India
    setValue('HCJ_ST_Student_Country', 'india');
    setValue('HCJ_ST_Student_Document_Domicile', 'India');

    // Fetch document details and countries
    fetchDocumentDetails('india');
  }, [setValue]);

  // Add this function to fetch location data by pincode
  const fetchLocationByPincode = async (pincode) => {
    if (pincode.length !== 6) return;

    setIsLoadingLocation(true);
    try {
      const response = await fetch(
        `/api/global/v1/gblArET90003FtchPinCdDtls?pincode=${pincode}`
      );
      const data = await response.json();

      if (data.success && data.data) {
        // Set state and city from API response
        setStateData(data.data.state || '');
        setCityData(data.data.city || '');

        // Update form values
        setValue('HCJ_ST_Student_State', data.data.state || '');
        setValue('HCJ_ST_Student_City', data.data.city || '');
      }
    } catch (error) {
      console.error('Error fetching location data:', error);
    } finally {
      setIsLoadingLocation(false);
    }
  };

  // Update the filterSpecializationsByProgram function to properly filter specializations
  const filterSpecializationsByProgram = (programName) => {
    if (!programName) {
      // If no program is selected, show all specializations
      setFilteredSpecializations(specializationData);
      return;
    }

    // Convert program name to lowercase for case-insensitive matching
    const lowerProgramName = programName.toLowerCase();

    // Find matching categories based on program name keywords
    const filtered = specializationData.filter((category) => {
      // Check if program name contains the category name or vice versa
      return (
        category.category.toLowerCase().includes(lowerProgramName) ||
        lowerProgramName.includes(category.category.toLowerCase()) ||
        // Check if program name matches any specialization
        category.specializations.some(
          (spec) =>
            spec.toLowerCase().includes(lowerProgramName) ||
            lowerProgramName.includes(spec.toLowerCase())
        )
      );
    });

    // If no matches found, show all data
    setFilteredSpecializations(
      filtered.length > 0 ? filtered : specializationData
    );
  };

  const searchParams = useSearchParams();
  const studentId = searchParams.get('id'); // Get student ID from query params

  useEffect(() => {
    if (studentId) {
      setValue(
        'HCJ_ST_InstituteNum',
        searchParams.get('institutionNumber') || ''
      );
      setValue(
        'HCJ_ST_Institution_Name',
        searchParams.get('institutionName') || ''
      );
      setValue(
        'HCJ_ST_Student_First_Name',
        searchParams.get('firstName') || ''
      );
      setValue('HCJ_ST_Student_Last_Name', searchParams.get('lastName') || '');
      setValue('HCJ_ST_Educational_Email', searchParams.get('email') || '');
      setValue('HCJ_ST_Phone_Number', searchParams.get('phone') || '');
      const genderMap = {
        '01': 'Male',
        '02': 'Female',
        '03': 'Others',
      };
      const genderValue = searchParams.get('gender');
      setValue('HCJ_ST_Gender', genderMap[genderValue] || 'Unknown');
      setValue('HCJ_ST_DOB', searchParams.get('dob') || '');
      setValue(
        'HCJ_ST_Student_Country',
        searchParams.get('country') || 'India'
      );
      setValue('HCJ_ST_Student_Pincode', searchParams.get('pincode') || '');
      setValue('HCJ_ST_Student_State', searchParams.get('state') || '');
      setValue('HCJ_ST_Student_City', searchParams.get('city') || '');
      setValue('HCJ_ST_Address', searchParams.get('address') || '');
      setValue(
        'HCJ_ST_Enrollment_Year',
        searchParams.get('enrollmentYear') || ''
      );
      setValue(
        'HCJ_ST_Student_Program_Name',
        searchParams.get('programName') || ''
      );
      setValue(
        'HCJ_ST_Student_Branch_Specialization',
        searchParams.get('specialization') || ''
      );
      setValue('HCJ_ST_Class_Of_Year', searchParams.get('classOfYear') || '');
      setValue('HCJ_ST_Score_Grade_Type', searchParams.get('gradeScore') || '');
      setValue('HCJ_ST_Score_Grade', searchParams.get('gradeValue') || '');
      setValue(
        'HCJ_ST_Student_Document_Type',
        searchParams.get('documentType') || ''
      );
      setValue(
        'HCJ_ST_Student_Document_Number',
        searchParams.get('documentNumber') || ''
      );

      // Handle Date conversion from string to Date object
      const dob = searchParams.get('dob');
      if (dob) {
        setValue('HCJ_ST_DOB', new Date(dob));
      }
    }
  }, [searchParams, setValue, studentId]);

  useEffect(() => {
    if (institutionData) {
      reset({
        HCJ_ST_Institution_Name: institutionData.CD_Company_Name || '',
        HCJ_ST_InstituteNum: institutionData.CD_Company_Num || '',
      });
    }
  }, [institutionData]);

  const onSubmit = async (formData) => {
    try {
      const data = new FormData();

      // Append form fields to FormData
      Object.keys(formData).forEach((key) => {
        if (key === 'photo' && formData.photo.length > 0) {
          data.append('photo', formData.photo[0]); // Handle photo upload
        } else if (
          key === 'HCJ_ST_DOB' &&
          formData.HCJ_ST_DOB instanceof Date
        ) {
          data.append(
            'HCJ_ST_DOB',
            formData.HCJ_ST_DOB.toISOString().split('T')[0] // Convert to YYYY-MM-DD
          );
        } else {
          data.append(key, formData[key]);
        }
      });

      // 🔹 Determine if it's an edit (PATCH) or a new student (POST)
      const isEditing = Boolean(studentId);
      const apiUrl = isEditing
        ? `/api/institution/v1/hcjBrBT60552ManageStudents?id=${studentId}` // PATCH for updating
        : `/api/institution/v1/hcjBrBT60551AddStudents`; // POST for new student

      const response = await fetch(apiUrl, {
        method: isEditing ? 'PATCH' : 'POST',
        body: data,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error saving student details');
      }

      //  Success Alert with Redirection
      Swal.fire({
        icon: 'success',
        title: isEditing
          ? 'Student updated successfully!'
          : 'Student added successfully!',
        text: 'What would you like to do next?',
        showCancelButton: true,
        confirmButtonText: isEditing
          ? 'Go to Dashboard'
          : 'Add Another Student',
        cancelButtonText: 'Go to Dashboard',
        reverseButtons: true,
      }).then((result) => {
        reset(); // Reset the form
        if (result.isConfirmed && !isEditing) {
          router.push('/institutn-dshbrd6051/add-stdnts6055');
        } else {
          router.push('/institutn-dshbrd6051');
        }
      });
    } catch (error) {
      console.error('Error saving student details:', error);

      //  Error Handling
      Swal.fire({
        icon: 'error',
        title: 'Failed to save student details',
        text: error.message || 'Please try again.',
        showCancelButton: true,
        confirmButtonText: 'Retry',
        cancelButtonText: 'Go to Dashboard',
        reverseButtons: true,
      }).then((result) => {
        if (result.dismiss === Swal.DismissReason.cancel) {
          router.push('/institutn-dshbrd6051');
        }
      });
    }
  };

  // const onSubmit = async (formData) => {
  //   try {
  //     const data = new FormData();
  //     Object.keys(formData).forEach((key) => {
  //       if (key === "photo" && formData.photo.length > 0) {
  //         data.append("photo", formData.photo[0]);
  //       } else if (
  //         key === "HCJ_ST_DOB" &&
  //         formData.HCJ_ST_DOB instanceof Date
  //       ) {
  //         data.append(
  //           "HCJ_ST_DOB",
  //           formData.HCJ_ST_DOB.toISOString().split("T")[0]
  //         ); // Convert to YYYY-MM-DD
  //       } else {
  //         data.append(key, formData[key]);
  //       }
  //     });

  //     const response = await fetch(
  //       "/api/institution/v1/hcjBrBT60551AddStudents",
  //       {
  //         method: "POST",
  //         body: data, // Send as FormData
  //       }
  //     );

  //     const result = await response.json();

  //     if (!response.ok) {
  //       throw new Error(result.error || "Error adding student");
  //     }

  //     Swal.fire({
  //       icon: "success",
  //       title: "Student added successfully!",
  //       text: "What would you like to do next?",
  //       showCancelButton: true,
  //       confirmButtonText: "Add Another Student",
  //       cancelButtonText: "Skip to Dashboard",
  //       reverseButtons: true,
  //     }).then((result) => {
  //       reset();
  //       if (result.isConfirmed) {
  //         router.push("/institutn-dshbrd6051/add-stdnts6055");
  //       } else {
  //         router.push("/institutn-dshbrd6051");
  //       }
  //     });
  //   } catch (error) {
  //     Swal.fire({
  //       icon: "error",
  //       title: "Failed to add student",
  //       text: error.message,
  //       showCancelButton: true,
  //       confirmButtonText: "Retry",
  //       cancelButtonText: "Skip to Dashboard",
  //       reverseButtons: true,
  //     });
  //   }
  // };

  return (
    <div className="flex items-start min-h-screen justify-center mt-10 sm:mt-20 dark:bg-gray-900 pb-20">
      <div className="w-full max-w-4xl rounded-lg border border:gray dark:shadow-lg p-8 bg-white dark:bg-gray-800">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-primary dark:text-blue-400">
            Add Student Data
          </h1>
          <Link href="stdnt-blk-imprt6056">
            <Button className="">Bulk Import</Button>
          </Link>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Institution Details */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-primary dark:text-gray-300">
                Education Institution Number{' '}
                <span className="text-destructive">*</span>
              </label>
              <Input
                type="text"
                placeholder="Institute Number"
                readOnly
                {...register('HCJ_ST_InstituteNum')}
                className={`${
                  errors.HCJ_ST_InstituteNum ? 'border-red-500' : ''
                } dark:bg-gray-700 dark:text-white`}
              />
              {errors.HCJ_ST_InstituteNum && (
                <p className="text-red-500 text-sm">
                  {errors.HCJ_ST_InstituteNum.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-primary dark:text-gray-300">
                Education Institution Name{' '}
                <span className="text-destructive">*</span>
              </label>
              <Input
                type="text"
                placeholder="Institute Name"
                readOnly
                {...register('HCJ_ST_Institution_Name')}
                className={`${
                  errors.HCJ_ST_Institution_Name ? 'border-red-500' : ''
                } dark:bg-gray-700 dark:text-white`}
              />
            </div>
          </div>

          {/* Student Name */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-primary dark:text-gray-300">
                Student First Name <span className="text-destructive">*</span>
              </label>
              <Input
                type="text"
                placeholder="First Name"
                {...register('HCJ_ST_Student_First_Name')}
                className={`${
                  errors.HCJ_ST_Student_First_Name ? 'border-red-500' : ''
                } dark:bg-gray-700 dark:text-white`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary dark:text-gray-300">
                Student Last Name <span className="text-destructive">*</span>
              </label>
              <Input
                type="text"
                placeholder="Last Name"
                {...register('HCJ_ST_Student_Last_Name')}
                className={`${
                  errors.HCJ_ST_Student_Last_Name ? 'border-red-500' : ''
                } dark:bg-gray-700 dark:text-white`}
              />
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-primary dark:text-gray-300">
                Student&apos;s Educational Institution Email ID{' '}
                <span className="text-destructive">*</span>
              </label>
              <Input
                type="email"
                placeholder="Institution Email"
                {...register('HCJ_ST_Educational_Email')}
                className={`${
                  errors.HCJ_ST_Educational_Email ? 'border-red-500' : ''
                } dark:bg-gray-700 dark:text-white`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary dark:text-gray-300">
                Student&apos;s Alternate Email ID
              </label>
              <Input
                type="email"
                placeholder="Alternate Email"
                {...register('HCJ_ST_Educational_Alternate_Email')}
                className="dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-primary dark:text-gray-300">
                Student&apos;s Phone Number{' '}
                <span className="text-destructive">*</span>
              </label>
              <Controller
                name="HCJ_ST_Phone_Number"
                control={control}
                render={({ field }) => (
                  <PhoneInput
                    {...field}
                    country={'in'}
                    inputClass={`${
                      errors.HCJ_ST_Phone_Number ? 'border-red-500' : ''
                    } dark:bg-gray-700 dark:text-white w-full`}
                    containerClass="w-full"
                    buttonClass="dark:bg-gray-600"
                    dropdownClass="dark:bg-gray-700 dark:text-white"
                    inputStyle={{
                      width: '100%',
                    }}
                  />
                )}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary dark:text-gray-300">
                Student&apos;s Alternate Phone No
              </label>
              <Controller
                name="HCJ_ST_Alternate_Phone_Number"
                control={control}
                render={({ field }) => (
                  <PhoneInput
                    {...field}
                    country={'in'}
                    inputClass="dark:bg-gray-700 dark:text-white"
                    containerClass="w-full"
                    buttonClass="dark:bg-gray-600"
                    dropdownClass="dark:bg-gray-700 dark:text-white"
                    inputStyle={{
                      width: '100%',
                    }}
                  />
                )}
              />
            </div>
          </div>

          {/* Gender and DOB */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-primary dark:text-gray-300">
                Gender <span className="text-destructive">*</span>
              </label>
              <Select
                onValueChange={(value) => setValue('HCJ_ST_Gender', value)}>
                <SelectTrigger className="dark:bg-gray-700 dark:text-white">
                  <SelectValue placeholder="Select Gender" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800">
                  <SelectItem value="01">Male</SelectItem>
                  <SelectItem value="02">Female</SelectItem>
                  <SelectItem value="03">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-primary dark:text-gray-300">
                Student&apos;s Date of Birth{' '}
                <span className="text-destructive">*</span>
              </label>
              <Controller
                control={control}
                name="HCJ_ST_DOB"
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate
                          ? format(selectedDate, 'PPP')
                          : 'Pick a date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => {
                          setSelectedDate(date);
                          setValue('HCJ_ST_DOB', date);
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
            </div>
          </div>

          {/* Location */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-primary dark:text-gray-300">
                Student&apos;s Country{' '}
                <span className="text-destructive">*</span>
              </label>
              <Controller
                name="HCJ_ST_Student_Country"
                control={control}
                defaultValue="india"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      // Fetch document details based on country
                      fetchDocumentDetails(value);
                    }}>
                    <SelectTrigger className="dark:bg-gray-700 dark:text-white">
                      <SelectValue placeholder="Select Country" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-800">
                      {countries.length > 0 ? (
                        countries.map((country, index) => (
                          <SelectItem key={index} value={country}>
                            {toSentenceCase(country)}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="india">India</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary dark:text-gray-300">
                Student&apos;s Pin code{' '}
                <span className="text-destructive">*</span>
              </label>
              <Input
                type="text"
                placeholder="Pin code"
                {...register('HCJ_ST_Student_Pincode')}
                onChange={(e) => {
                  const value = e.target.value;
                  setValue('HCJ_ST_Student_Pincode', value);
                  if (value.length === 6) {
                    fetchLocationByPincode(value);
                  }
                }}
                className={`${
                  errors.HCJ_ST_Student_Pincode ? 'border-red-500' : ''
                } dark:bg-gray-700 dark:text-white`}
              />
              {isLoadingLocation && (
                <p className="text-xs text-primary mt-1">
                  Fetching location data...
                </p>
              )}
            </div>
          </div>

          {/* State and City */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-primary dark:text-gray-300">
                Student&apos;s State <span className="text-destructive">*</span>
              </label>
              <Input
                type="text"
                placeholder="State"
                value={stateData}
                onChange={(e) => {
                  setStateData(e.target.value);
                  setValue('HCJ_ST_Student_State', e.target.value);
                }}
                className={`${
                  errors.HCJ_ST_Student_State ? 'border-red-500' : ''
                } dark:bg-gray-700 dark:text-white`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary dark:text-gray-300">
                Student&apos;s City <span className="text-destructive">*</span>
              </label>
              <Input
                type="text"
                placeholder="City"
                value={cityData}
                onChange={(e) => {
                  setCityData(e.target.value);
                  setValue('HCJ_ST_Student_City', e.target.value);
                }}
                className={`${
                  errors.HCJ_ST_Student_City ? 'border-red-500' : ''
                } dark:bg-gray-700 dark:text-white`}
              />
            </div>
          </div>

          {/* Address */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-primary dark:text-gray-300">
                Address <span className="text-destructive">*</span>
              </label>
              <Input
                type="text"
                placeholder="Enter Address"
                {...register('HCJ_ST_Address', {
                  required: 'Address is required',
                })}
                className={`${
                  errors.HCJ_ST_Address ? 'border-red-500' : ''
                } dark:bg-gray-700 dark:text-white`}
              />
              {errors.HCJ_ST_Address && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.HCJ_ST_Address.message}
                </p>
              )}
            </div>
          </div>

          {/* Program Details */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-primary dark:text-gray-300">
                Program Name <span className="text-destructive">*</span>
              </label>
              {/* <Input
                type="text"
                placeholder="Program Name"
                {...register("HCJ_ST_Student_Program_Name")}
                onChange={(e) => {
                  setValue("HCJ_ST_Student_Program_Name", e.target.value)
                  setSelectedProgram(e.target.value)
                  filterSpecializationsByProgram(e.target.value)
                }}
                className={`${
                  errors.HCJ_ST_Student_Program_Name ? "border-red-500" : ""
                } dark:bg-gray-700 dark:text-white`}
              /> */}
              <Select
                onValueChange={(value) => {
                  setValue('HCJ_ST_Student_Program_Name', value);
                  setSelectedProgram(value);
                  filterSpecializationsByProgram(value);
                }}>
                <SelectTrigger className="dark:bg-gray-700 dark:text-white">
                  <SelectValue placeholder="Select Program" />
                </SelectTrigger>
                <SelectContent className="h-80 overflow-y-auto dark:bg-gray-800">
                  {specializationData.map((data, index) => (
                    <SelectItem key={index} value={data.category}>
                      {data.category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-primary dark:text-gray-300">
                Branch/Specialization{' '}
                <span className="text-destructive">*</span>
              </label>
              <Select
                onValueChange={(value) =>
                  setValue('HCJ_ST_Student_Branch_Specialization', value)
                }>
                <SelectTrigger className="dark:bg-gray-700 dark:text-white">
                  <SelectValue placeholder="Select Branch/Specialization" />
                </SelectTrigger>
                <SelectContent className="h-80 overflow-y-auto dark:bg-gray-800">
                  {filteredSpecializations.map((category, categoryIndex) => (
                    <React.Fragment key={`category-${categoryIndex}`}>
                      <SelectItem
                        value={`heading-${categoryIndex}`}
                        disabled
                        className="font-bold text-primary">
                        {category.category}
                      </SelectItem>

                      {category.specializations.map(
                        (specialization, specIndex) => (
                          <SelectItem
                            key={`spec-${categoryIndex}-${specIndex}`}
                            value={`${categoryIndex}-${specialization
                              .toLowerCase()
                              .replace(/\s+/g, '_')}`}>
                            {specialization}
                          </SelectItem>
                        )
                      )}
                    </React.Fragment>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Documents */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-primary dark:text-gray-300">
                Grade/Score <span className="text-destructive">*</span>
              </label>
              <Select
                onValueChange={(value) =>
                  setValue('HCJ_ST_Score_Grade_Type', value)
                }>
                <SelectTrigger className="dark:bg-gray-700 dark:text-white">
                  <SelectValue placeholder="Select Grade/Score" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800">
                  <SelectItem value="grade">Grade</SelectItem>
                  <SelectItem value="score">Score</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary dark:text-gray-300">
                Grade/Score Value <span className="text-destructive">*</span>
              </label>
              <Input
                type="text"
                placeholder="Enter value"
                {...register('HCJ_ST_Score_Grade')}
                className={`${
                  errors.HCJ_ST_Score_Grade ? 'border-red-500' : ''
                } dark:bg-gray-700 dark:text-white`}
              />
            </div>
          </div>

          {/* Grade/Score */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-primary dark:text-gray-300">
                Program Enrolled Year{' '}
                <span className="text-destructive">*</span>
              </label>
              <Input
                type="text"
                placeholder="Program Enrolled Year"
                {...register('HCJ_ST_Enrollment_Year')}
                className={`${
                  errors.HCJ_ST_Enrollment_Year ? 'border-red-500' : ''
                } dark:bg-gray-700 dark:text-white`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary dark:text-gray-300">
                Student&apos;s Document Type{' '}
                <span className="text-destructive">*</span>
              </label>
              <Select
                onValueChange={(value) =>
                  setValue('HCJ_ST_Student_Document_Type', value)
                }>
                <SelectTrigger className="dark:bg-gray-700 dark:text-white">
                  <SelectValue placeholder="Select Document Type" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800">
                  {documentTypes.length > 0 && documentTypes[0]?.document ? (
                    documentTypes[0].document.map((doc, index) => (
                      <SelectItem key={index} value={doc.value}>
                        {toSentenceCase(doc.label)}
                      </SelectItem>
                    ))
                  ) : (
                    <>
                      <SelectItem value="passport">Passport</SelectItem>
                      <SelectItem value="voter_id">Voter ID</SelectItem>
                      <SelectItem value="aadhaar">Aadhaar</SelectItem>
                      <SelectItem value="pan_card">PAN Card</SelectItem>
                      <SelectItem value="driving_license">
                        Driving License
                      </SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Alternate Contact and Document Number */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-primary dark:text-gray-300">
                Student&apos;s Document Domicile{' '}
                <span className="text-destructive">*</span>
              </label>
              <Input
                type="text"
                placeholder="Document Domicile"
                {...register('HCJ_ST_Student_Document_Domicile')}
                className={`${
                  errors.HCJ_ST_Student_Document_Domicile
                    ? 'border-red-500'
                    : ''
                } dark:bg-gray-700 dark:text-white`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary dark:text-gray-300">
                Student&apos;s Document Number{' '}
                <span className="text-destructive">*</span>
              </label>
              <Input
                type="text"
                placeholder="Document Number"
                {...register('HCJ_ST_Student_Document_Number')}
                className={`${
                  errors.HCJ_ST_Student_Document_Number ? 'border-red-500' : ''
                } dark:bg-gray-700 dark:text-white`}
              />
            </div>
          </div>

          {/* Alternate Email and Class Year */}

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-primary dark:text-gray-300">
                  Class of Year <span className="text-destructive">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="Class Year"
                  {...register('HCJ_ST_Class_Of_Year')}
                  className={`${
                    errors.HCJ_ST_Class_Of_Year ? 'border-red-500' : ''
                  } dark:bg-gray-700 dark:text-white`}
                />
              </div>
            </div>

            {/* Right Side - Upload Physical Documents */}
            <div>
              <label className="block text-sm font-medium text-primary dark:text-gray-300">
                Upload Photo of Document{' '}
                {/* <span className="text-destructive">*</span> */}
              </label>
              <div className="border-2 border-dashed border-primary dark:border-gray-600 rounded-lg p-6 text-center">
                <input
                  type="file"
                  className="hidden"
                  id="file-upload"
                  accept="image/*"
                  {...register('photo')}
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center justify-center">
                  <Upload className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                  <span className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Click here to upload your file or drag and drop
                  </span>
                  <span className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Supported formats: JPG, PNG
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex flex-col items-center text-center space-y-4">
            <Button
              type="submit"
              className="w-64 px-6 py-2 text-white bg-primary dark:bg-blue-600 rounded-md hover:bg-primary/90 dark:hover:bg-blue-700">
              Add Student
            </Button>
          </div>
        </form>

        <ToastContainer />
      </div>
    </div>
  );
}

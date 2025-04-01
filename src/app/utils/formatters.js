export const formatAadhaar = (value) => {
  return value
    .replace(/\D/g, '')
    .slice(0, 12)
    .replace(/(\d{4})/g, '$1 ')
    .trim();
};

export const formatVoterID = (value) => {
  return value
    .toUpperCase()
    .replace(/(\w{3})(\d{7})/, '$1 $2')
    .trim();
};

export const formatSSN = (value) => {
  return value
    .replace(/\D/g, '')
    .slice(0, 9)
    .replace(/^(\d{3})(\d{2})?(\d{4})?$/, '$1-$2-$3')
    .trim();
};

export const formatDrivingLicense = (value) => {
  return value
    .toUpperCase()
    .replace(/(\w{2})(\d{2})?(\d{11})?/, '$1 $2 $3')
    .trim();
};

// New: Passport Formatting
export const formatPassport = (value) => {
  const cleanedValue = value
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 9);
  if (/^[A-Z]\d{7}$/.test(cleanedValue)) {
    return cleanedValue.replace(/^([A-Z])(\d{7})$/, '$1 $2'); // Format: A 1234567 (India)
  } else if (/^\d{9}$/.test(cleanedValue)) {
    return cleanedValue.replace(/^(\d{3})(\d{3})(\d{3})$/, '$1-$2-$3'); // Format: 123-456-789 (USA)
  }
  return cleanedValue;
};

// Apply formatting dynamically based on document type
export const applyFormatting = (docType, value) => {
  if (!value) return '';
  if (docType === 'Aadhaar') return formatAadhaar(value);
  if (docType === 'Voter ID') return formatVoterID(value);
  if (docType === 'SSN') return formatSSN(value);
  if (docType === 'Driving License') return formatDrivingLicense(value);
  if (docType === 'Passport') return formatPassport(value);
  return value;
};

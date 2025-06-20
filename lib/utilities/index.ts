import qs from 'query-string';

// 03 - 05-load-products-from-database.md
// convert the Prisma result to a plain JavaScript object
export function convertToPlainObject<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

// Format number with decimal places
// 03 - 06-zod-validation-and-type-inference.md
// type is number and return is a string
export function formatNumberWithDecimal(num: number): string {      
  const [int, decimal] = num.toString().split('.');
  return decimal ? `${int}.${decimal.padEnd(2, '0')}` : `${int}.00`;
}

// Format Errors
// 14-sign-up-error-handling.md
// Disable ESLint rule for the next lin
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatError(error: any): string {
  if (error.name === 'ZodError') {
    const fieldErrors = Object.keys(error.errors).map((field) => {                              // Handle Zod error
      const message = error.errors[field].message;
      return typeof message === 'string' ? message : JSON.stringify(message);
    });
    return fieldErrors.join('. ');
  } else if (error.name === 'PrismaClientKnownRequestError' && error.code === 'P2002') {
    const field = error.meta?.target ? error.meta.target[0] : 'Field';                          // Handle Prisma error
    return `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  } else {
    return typeof error.message === 'string' ? error.message : JSON.stringify(error.message);    // Handle other errors
  }
}

// Round to 2 decimal places
// 06-price-calc-add-to-database.md
export const round2 = (value: number | string) => {
  if (typeof value === 'number') {
    return Math.round((value + Number.EPSILON) * 100) / 100;                // avoid rounding errors
  } else if (typeof value === 'string') {
    return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
  } else {
    throw new Error('value is not a number nor a string');
  }
};

// 04-subtotal-card.md
// calling from formatCurrency()
const CURRENCY_FORMATTER = new Intl.NumberFormat('en-US', {
  currency: 'USD',
  style: 'currency',
  minimumFractionDigits: 2,
});

// Format currency
// 04-subtotal-card.md
export function formatCurrency(amount: number | string | null) {
  if (typeof amount === 'number') {
    return CURRENCY_FORMATTER.format(amount);
  } else if (typeof amount === 'string') {
    return CURRENCY_FORMATTER.format(Number(amount));
  } else {
    return 'NaN';
  }
}

// 11-format-utility-functions.md, ch 74
// Shorten ID
export function formatId(id: string) {
  return `..${id.substring(id.length - 6)}`;
}

// Format Date Time , ch74
export const formatDateTime = (dateString: Date) => {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    month: 'short',       // abbreviated month name (e.g., 'Oct')
    year: 'numeric',      // abbreviated month name (e.g., 'Oct')
    day: 'numeric',       // numeric day of the month (e.g., '25')
    hour: 'numeric',      // numeric hour (e.g., '8')
    minute: 'numeric',    // numeric minute (e.g., '30')
    hour12: true,         // use 12-hour clock (true) or 24-hour clock (false)
  };
  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: 'short',     // abbreviated weekday name (e.g., 'Mon')
    month: 'short',       // abbreviated month name (e.g., 'Oct')
    year: 'numeric',      // numeric year (e.g., '2023')
    day: 'numeric',       // numeric day of the month (e.g., '25')
  };
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric',    // numeric hour (e.g., '8')
    minute: 'numeric',  // numeric minute (e.g., '30')
    hour12: true,       // use 12-hour clock (true) or 24-hour clock (false)
  };
  const formattedDateTime: string = new Date(dateString).toLocaleString(
    'en-US',
    dateTimeOptions
  );
  const formattedDate: string = new Date(dateString).toLocaleString(
    'en-US',
    dateOptions
  );
  const formattedTime: string = new Date(dateString).toLocaleString(
    'en-US',
    timeOptions
  );
  
  return {
    dateTime: formattedDateTime,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  };
};

// Form Pagination Links
// 05-orders-pagination.md
// ch 89
export function formUrlQuery({ params, key, value }: { params: string; key: string; value: string | null }) {
  const query = qs.parse(params);                     // parse the query string into an object, name=hy&age=23 => { name: 'hy', age: '23' }
  console.log('utilities params :', params);          // this is use client, will be shown in the browser console
  console.log('utilities key :', key);                   
  console.log('utilities value :', value);                  
  query[key] = value;                                // add or update the key-value pair
  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query,
    },
    { skipNull: true }
  );
}

// Format Numberc ch 96
const NUMBER_FORMATTER = new Intl.NumberFormat('en-US');

export function formatNumber(number: number) {
  return NUMBER_FORMATTER.format(number);
}
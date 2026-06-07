import dns from "dns/promises";

// list of known disposable/fake email providers
const blockedDomains = [
  "mailinator.com",
  "tempmail.com",
  "guerrillamail.com",
  "10minutemail.com",
  "throwaway.email",
  "yopmail.com",
  "sharklasers.com",
  "guerrillamailblock.com",
  "grr.la",
  "guerrillamail.info",
  "spam4.me",
  "trashmail.com",
  "trashmail.me",
  "dispostable.com",
  "mailnull.com",
  "spamgourmet.com",
  "spamgourmet.net",
  "fakeinbox.com",
  "maildrop.cc",
  "discard.email",
  "tempr.email",
  "getnada.com",
  "anonaddy.com",
  "temp-mail.org",
  "emailondeck.com",
];

const validateEmail = async (email) => {

  // LAYER 1 — format check using regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      valid: false,
      message: "Invalid email format",
    };
  }

  const domain = email.split("@")[1].toLowerCase();

  // LAYER 2 — disposable email check
  if (blockedDomains.includes(domain)) {
    return {
      valid: false,
      message: "Disposable email addresses are not allowed",
    };
  }

  // LAYER 3 — DNS MX record check
  try {
    const mxRecords = await dns.resolveMx(domain);
    // if mxRecords is empty array → domain exists but no mail server
    if (!mxRecords || mxRecords.length === 0) {
      return {
        valid: false,
        message: "Email domain does not accept emails",
      };
    }
  } catch (error) {
    // dns.resolveMx throws if domain doesn't exist at all
    return {
      valid: false,
      message: "Email domain does not exist",
    };
  }

  // all 3 layers passed
  return { valid: true, message: "Email is valid" };
};

export default validateEmail;
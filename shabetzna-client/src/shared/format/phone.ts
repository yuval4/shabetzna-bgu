export const formatPhone = (phone?: string) => {
  return phone ? phone.substring(0, 3) + "-" + phone.substring(3, 10) : "";
};

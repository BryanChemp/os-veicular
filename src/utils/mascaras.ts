export const formatTelefone = (value: string) => {
  const numbers = unmask(value).slice(0, 11)

  if (numbers.length <= 2) return `(${numbers}`
  if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`
  return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`
}

export const formatCnpj = (value: string) => {
  const numbers = unmask(value).slice(0, 14)

  if (numbers.length <= 2) return numbers
  if (numbers.length <= 5) return `${numbers.slice(0, 2)}.${numbers.slice(2)}`
  if (numbers.length <= 8) return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5)}`
  if (numbers.length <= 12) return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8)}`
  return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8, 12)}-${numbers.slice(12)}`
}

export const formatCurrency = (value: string) => {
  const digits = unmask(value);

  const amount = (Number(digits) / 100).toFixed(2);
  const [integer, decimal] = amount.split(".");
  const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  
  return `R$ ${formattedInteger},${decimal}`;
};

export const currencyToFloat = (value: string) => {
  if (!value) return 0;
  return Number(unmask(value)) / 100;
}

export const unmask = (value: string) => value.replace(/\D/g, "")

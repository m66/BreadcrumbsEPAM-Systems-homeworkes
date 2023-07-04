function required(val: number | string) {
  return val ? null : 'The field is required'
}

function nameValidation(name: string) {
  const regex = /^[a-zA-Z]+$/i

  if (!regex.test(name)) {
    return 'Write a correct name! [a - Z]'
  }

  return null
}

function maxLength(length: number) {
  return function (val: string) {
    return val.length > length
      ? `Input can contain maximum ${length} charackters.`
      : null
  }
}

function minLength(length: number) {
  return function (val: string) {
    return val.length < length
      ? `Input can contain minimum ${length} charackters.`
      : null
  }
}

function maxNum(maxVal: number) {
  return function (num: number) {
    return num > maxVal ? `${num} must be less than ${maxVal}.` : null
  }
}

function minNum(minVal: number) {
  return function (num: number) {
    return num < minVal ? `${num} must be greater than ${minVal}.` : null
  }
}

function numberValidation(num: number) {
  return isNaN(num) ? `${num} must be a number.` : null
}

function genderValidation(gen: string) {
  return ((gen !== "male") && (gen !== "female")) ?  `Insted of "${gen}" you need to choose male of female.` : null;
}

/* create validation */
function createValidation(validations: any[]) {
  return function (val: string | number) {
    for (let validation of validations) {
      const error = validation(val)
      if (error) return error
    }
    return null;
  }
}



export const validations: { [key: string]: (val: string | number) => any } = {
  name: createValidation([required, minLength(4), maxLength(36), nameValidation]),
  age: createValidation([required, numberValidation, minNum(4), maxNum(80)]),
  gender: createValidation([required, genderValidation])
}
export function generatePassword() {
	const length = 8;
	const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*+?><";
	let password = "";

	const getRandomChar = (chars: string | any[]) =>
		chars[Math.floor(Math.random() * chars.length)];

	// Ensure at least one uppercase letter, one number, and one special character
	password += getRandomChar("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
	password += getRandomChar("0123456789");
	password += getRandomChar("!@#$%^&*()_+~`|}{[]:;?><,./-=");

	// Fill the rest of the password length with random characters
	for (let i = password.length; i < length; i++) {
		password += getRandomChar(charset);
	}

	// Shuffle the password to mix the guaranteed characters with the rest
	password = password
		.split("")
		.sort(() => 0.5 - Math.random())
		.join("");

	return password;
}

import {BinaryLike, createCipheriv, createDecipheriv, randomBytes, scryptSync } from "crypto"; 

const encrypter = {
    algorithm: "aes-192-cbc",
    key: scryptSync(encryptionKey, salt, 24)
}

encrypter.encrypt = (clearText) => {
    const iv = randomBytes(16);
      const cipher = createCipheriv(this.algorithm, this.key, iv);
      const encrypted = cipher.update(clearText, "utf8", "hex");
      return [
        encrypted + cipher.final("hex"),
        Buffer.from(iv).toString("hex")
      ].join("|");
}

encrypter.decrypt = (encryptedText) => {
    const [encrypted, iv] = encryptedText.split("|");
    if (!iv) throw new Error("IV not found");
    const decipher = createDecipheriv(
    this.algorithm,
    this.key,
    Buffer.from(iv, "hex")
    );
    return decipher.update(encrypted, "hex", "utf8") + decipher.final("utf8");
}
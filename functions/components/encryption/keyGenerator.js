import { createDiffieHellman, DiffieHellman } from "crypto";

const keyGenerator = {
    initiator: DiffieHellman,
    recipient: DiffieHellman
};

keyGenerator.initiatorkey = () => {
    const first = createDiffieHellman(512);
    this.initiator = first;
    const key = first.generateKeys("base64");
    const prime = first.getPrime("base64");
    const generator = first.getGenerator("base64");

    return [key, prime, generator];

};

keyGenerator.recipientkey = (key) => { 
    const second = createDiffieHellman(
        Buffer.from(prime, "base64"),
        Buffer.from(generator, "base64")
      );
      this.recipient = second;
      return second.generateKeys("base64");
};

keyGenerator.initiatorSecret = (recipientKey) => {
    const secret = this.initiator.computeSecret(
        recipientKey,
        "base64",
        "base64"
      );
      return secret;
};

keyGenerator.recipientSecret = (initiatorKey) => {
    const secret = this.recipient.computeSecret(
        initiatorKey,
        "base64",
        "base64"
      );
      return secret;
};

export default keyGenerator;
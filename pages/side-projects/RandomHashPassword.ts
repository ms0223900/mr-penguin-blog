export class RandomHashPassword {
    generate({
                 withSpecialChar = false,
                 length = 8,
             } = {
        withSpecialChar: false as boolean,
        length: 8,
    }) {
        let hashed: string;
        hashed = Math.random().toString(36).slice(2) + new Date().getTime().toString(36);
        hashed = hashed.slice(0, withSpecialChar ? length - 1 : length)
        hashed += withSpecialChar ? this.#getSpecialChar() : ''
        const newHashed = this.makeOneCharacterUppercase(hashed);
        return newHashed;
    }

    makeOneCharacterUppercase(text = '') {
        let res = ''
        for (let i = 0; i < text.length; i++) {
            const currentChar = this.#getCurrentChar(text[i], res);
            res += currentChar
        }
        return res;
    }

    // @ts-ignore
    #getSpecialChar() {
        return ['&', '.', '_', '-'][0];
    }

    // @ts-ignore
    #getCurrentChar(currentOriginChar = '', currentAllText = '') {
        if (this.#isNoneAlphabetUppercased(currentAllText)) {
            return currentOriginChar.toUpperCase();
        } else {
            return currentOriginChar;
        }
    }

    // @ts-ignore
    #isNoneAlphabetUppercased(currentAllText = '') {
        return currentAllText.match(/[A-Z]/) === null;
    }
}

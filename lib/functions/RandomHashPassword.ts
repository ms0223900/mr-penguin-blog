function getRandIdx(min: any, max: any) {
    return min + ~~((max - min) * Math.random());
}

export class RandomHashPassword {
    generate({
                 withSpecialChar = false,
                 length = 8,
             } = {
        withSpecialChar: false as boolean,
        length: 8,
    }) {
        let hashed: string;
        hashed = getRandIdx(10, 100) + Math.random().toString(36).slice(4) + new Date().getTime().toString(36);
        hashed = hashed.slice(0, withSpecialChar ? length - 1 : length)
        hashed += withSpecialChar ? this.getSpecialChar() : ''
        const newHashed = this.makeOneCharacterUppercase(hashed);
        return newHashed;
    }

    private makeOneCharacterUppercase(text = '') {
        let res = ''
        for (let i = 0; i < text.length; i++) {
            const currentChar = this.getCurrentChar(text[i], res);
            res += currentChar
        }
        return res;
    }

    private getSpecialChar() {
        const specialChars = ['&', '.', '_', '-'];
        const idx = getRandIdx(0, specialChars.length);
        return specialChars[idx];
    }

    private getCurrentChar(currentOriginChar = '', currentAllText = '') {
        if (this.isNoneAlphabetUppercased(currentAllText)) {
            return currentOriginChar.toUpperCase();
        } else {
            return currentOriginChar;
        }
    }

    private isNoneAlphabetUppercased(currentAllText = '') {
        return currentAllText.match(/[A-Z]/) === null;
    }
}

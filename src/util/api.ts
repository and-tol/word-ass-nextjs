export { }

const getWordFile = async (wordType: string) =>
    (
        await fetch( // fetch - Next.js предоставляет полифилл для API , поэтому мы можем использовать его на бэкенде! 
            (process.env.NODE_ENV === 'production' ?
                "<https://words-aas.vercel.app/db/>" : "<http://localhost:3000/db/>" + wordType)
        )
    ).text()

const getRandomWord = (contents: string) => {
    contents = contents.replace(/[\\r]/g, '')
    const words = contents.split('\\n')
    // the last element in the words files is a blank line, so
    // we will remove it so as to not return an empty string!
    words.pop()
    const i = Math.floor(Math.random() * words.length)
    return words[i]
}

async function phraseGenerator (words: string[]) {
    let phrase = ''
    const allWordType = ["adjective", "adverb", "animal", "bodyPart", "gerund", "noun", "pluralNoun", "verb"]
    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        if (word === '' || (word === 'a' && i === 0)) continue;
        if (word.slice(0, 1) === '$') {

            if (!allWordType.includes(word.slice(1))) {
                throw Error("word type not found")
            } else {
                const filePath = word.slice(1) + 's.text'
                phrase += getRandomWord(await getWordFile(filePath)) + ' '
            }
        } else phrase += word + ''
    }

    return phrase.slice(0, -1)
}

/**
 * Эта функция используется для определения того, является ли первая буква
 *  в предоставленном phraseслове гласной, 
 * которая затем будет использоваться для определения того, 
 * следует ли преобразовать первое слово a в .
 * Эта функция использует выражение RegExp, 
 * которое проверяет глобальные ( g) гласные ( [aeiou]) 
 * в нижнем или верхнем регистре ( i).
 * @param phrase 
 * @returns 
 */
const vowelTester = (phrase: string): boolean => new RegExp(/[aeiou]/gi).test(phrase[0]);




/**
 * Эта функция объединяет все предыдущие подсистемы.
 * @param query 
 * @returns 
 */
export async function phraseResolver(query: string): Promise<string> {
    const words = query.split(" ");
    let phrase = await phraseGenerator(words);
    if (words[0] == "a") 
      phrase = (vowelTester(phrase) ? "an" : "a") + " " + phrase;
    return phrase;
  }
  type ReturnPhraseResolver = Awaited<ReturnType<typeof phraseResolver>>

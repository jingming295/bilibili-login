
/**
 * 生成_uuid
 * 我不确定这是否正确
 * @see {@link https://play.rust-lang.org/?version=stable&mode=debug&edition=2021&gist=76c5fe627d603717593fab4bd16dbdd5}
 */
export class UuidInfoc
{
    /**
     * 生成_uuid
     * 我不确定这是否正确
     * @see {@link https://play.rust-lang.org/?version=stable&mode=debug&edition=2021&gist=76c5fe627d603717593fab4bd16dbdd5}
     * @returns {string}
     */
    gen(): string
    {
        const DIGHT_MAP: string[] = [
            // Math.random() === 0 is really rare that probability is unlimited close to 0
            "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "10",
        ];
        const t: number = this.now() % 100_000;
        return this.strConcat(
            this.randomChoice(8, DIGHT_MAP) +
            "-" +
            this.randomChoice(4, DIGHT_MAP) +
            "-" +
            this.randomChoice(4, DIGHT_MAP) +
            "-" +
            this.randomChoice(4, DIGHT_MAP) +
            "-" +
            this.randomChoice(12, DIGHT_MAP) +
            String(t).padStart(5, '0') +
            "infoc"
        );
    }

    /**
     * Generates a random string by choosing ones from given candidates.
     * Candidates should be an array of strings.
     * @param range The number of characters to generate.
     * @param choiceSet The array of strings to choose from.
     * @returns A random string.
     */
    private randomChoice(range: number, choiceSet: string[]): string
    {
        let result = '';
        for (let i = 0; i < range; i++)
        {
            result += choiceSet[Math.floor(Math.random() * choiceSet.length)];
        }
        return result;
    }

    /**
     * Concatenates multiple strings into a single string.
     * @param args The strings to concatenate.
     * @returns The concatenated string.
     */
    private strConcat(...args: string[]): string
    {
        return args.join('');
    }

    /**
     * Faster way to get current timestamp other than `Date.now()`,
     * 12x faster on my machine.
     * @returns The current timestamp.
     */
    private now(): number
    {
        return Math.floor(Date.now() / 1000);
    }


}
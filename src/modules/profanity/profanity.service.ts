import Filter from "bad-words";

class ProfanityService {
    private readonly filter = new Filter();

    public check(text: string): boolean {
        return this.filter.isProfane(text);
    }
}

export const profanityService = new ProfanityService();

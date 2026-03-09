export class InternalErrorException extends Error {
    constructor(message: string) {
        super(message);
        this.name = "InternalError";
    }
}

import Validator, { ValidationError } from "fastest-validator";
import { ApiError } from "../utils/Error/ApiError";

export class MainDataService {
    private v = new Validator();
    private schema = {};

    constructor(schema: Object) {
        this.schema = schema;
    }
    
    public validate(data: any): void {
        const check = this.v.compile(this.schema);

        const result = check(data);
        
        if (result !== true) {
            throw new ApiError(404, `Error data validation: ${JSON.stringify(result)}`);
        }
    }
}
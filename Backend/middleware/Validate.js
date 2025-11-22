//Parse requests using Zod

export function validate(schema) {
    return (req, res, next) => {
        const parsed = schema.safeParse(req.body);

        if (!parsed.success) {

            //Mapping All Errors from Zod
            const errorMessages = parsed.error.issues.map(issue => issue.message)

            //Joining error messages to one String
            const errorString = errorMessages.join(`, `)
            
            //Return response message
            return res.status(400).json({
                message: "invalid request data",
                error: errorString
            })
        }
        req.validated = parsed.data;
        next();
    }
}

/// <reference path="../pb_data/types.d.ts" />
// noinspection JSUnresolvedReference

module.exports = {
    /*
     * @param {string} input Text prompt describing foods
     */
    getResponse: (input) => {

        let instructions, fs, reader;
        try {
            fs = $filesystem.local(__hooks);
            reader = fs.getReader('instructions.md');
            instructions = toString(reader);
        } finally {
            fs.close();
            reader.close();
        }

        const req = {
            method: 'POST',
            url: `${process.env.OPENAI_URL}/v1/responses`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "openai/gpt-5.4-nano",
                instructions,
                input,
                text: {
                    format: {
                        type: 'json_schema',
                        name: 'nutritional_facts',
                        strict: true,
                        schema: {
                            type: "object",
                            properties: {
                                calories: {
                                    type: ["number", "null"],
                                    description: "Total calories of all food items"
                                },
                                protein: {
                                    type: ["number", "null"],
                                    description: "Total protein of all food items"
                                },
                                fats: {
                                    type: ["number", "null"],
                                    description: "Total fats of all food items"
                                },
                                carbs: {
                                    type: ["number", "null"],
                                    description: "Total carbohydrates of all food items"
                                },
                                comment: {
                                    type: "string",
                                    description: "Summary of thinking process and breakdown of all foods nutritional facts",
                                }
                            },
                            required: ["calories", "protein", "fats", "carbs", "comment"],
                            additionalProperties: false
                        }
                    }
                }
            })
        };
        $app.logger().info('Sending ai request', 'request', req);

        return $http.send(req);
    }
}
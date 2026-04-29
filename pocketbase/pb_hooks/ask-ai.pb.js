/// <reference path="../pb_data/types.d.ts" />

routerAdd('POST', '/api/ask-ai', e => {

    // Request data
    const user = e.auth.id;
    const request = new DynamicModel({
        prompt: ''
    });
    e.bindBody(request);

    // Check limits
    const now = new DateTime();
    const yesterday = now.addDate(0, 0, -1);
    const recentPrompts = $app.countRecords('aiPrompts',
        $dbx.exp('created >= {:yesterday}', { yesterday }),
        $dbx.exp('user = {:user}', { user })
    );
    $app.logger().info('Checking prompt limit', 'user', user, 'prompts', recentPrompts);
    if (recentPrompts >= 10) {
        return e.tooManyRequestsError('Too many ai prompts per last day', { });
    }

    // Registering request
    const collection = $app.findCollectionByNameOrId('aiPrompts');
    const prompt = new Record(collection, {
        prompt: request.prompt,
        user,
        comment: ''
    });
    $app.save(prompt);
    $app.logger().info('Registered ai prompt', 'prompt', prompt);

    // Sending ai request
    // noinspection JSUnresolvedReference

    const ai = require(`${__hooks}/openai.js`);
    const res = ai.getResponse(request.prompt);
    const response = res.json;

    prompt.set('response', response);
    $app.save(prompt);

    if (res.statusCode >= 400 && res.statusCode <= 599) {
        $app.logger().warn('Ai api response failed', 'response', res);
        return e.internalServerError('ai_error', { response: res })
    } else {
        $app.logger().info('Received api response', 'response', res);
    }

    return e.json(200, prompt);

}, $apis.requireAuth())
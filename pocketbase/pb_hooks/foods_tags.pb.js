/// <reference path="../pb_data/types.d.ts" />
// noinspection DuplicatedCode

onRecordCreate((e) => {
    try {
        const tags = [
            e.record.getString('name'),
            e.record.getString('description')
        ].join(' ').toLowerCase();
        e.record.set('tags', tags);
        $app.logger().info('Tags updated successfully', { e });
    } catch (e) {
        $app.logger().error('Error normalizing tags', { e });
    }
    e.next();
}, 'foods');
onRecordUpdate((e) => {
    try {
        const tags = [
            e.record.getString('name'),
            e.record.getString('description')
        ].join(' ').toLowerCase();
        e.record.set('tags', tags);
        $app.logger().info('Tags updated successfully', { e });
    } catch (e) {
        $app.logger().error('Error normalizing tags', { e });
    }
    e.next();
}, 'foods');
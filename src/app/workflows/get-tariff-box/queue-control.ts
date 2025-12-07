import Queue from "queue";

/** The queue is needed in case there are two tasks next to each other to change the table, so that they work exactly one after the other. */
export const queueControl = new Queue({
    concurrency: 1,
    autostart: true,
});

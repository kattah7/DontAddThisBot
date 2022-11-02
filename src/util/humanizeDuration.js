const humanize = require('humanize-duration');

const humanizeDuration = (ms) => {
    const options = {
        language: 'shortEn',
        languages: {
            shortEn: {
                y: () => 'y',
                mo: () => 'mo',
                w: () => 'w',
                d: () => 'd',
                h: () => 'h',
                m: () => 'm',
                s: () => 's',
                ms: () => 'ms',
            },
        },
        units: ['y', 'mo', 'd', 'h', 'm', 's'],
        largest: 4,
        round: true,
        conjunction: ' and ',
        spacer: '',
    };
    return humanize(ms, options);
};

module.exports = humanizeDuration;

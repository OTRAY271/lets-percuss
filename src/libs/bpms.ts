let bpms = new Array<number>();

export default function getBpms() {
    if (bpms.length === 0) calBpms();
    return bpms;
}

function calBpms() {
    bpms.push(40);
    for (let bpm = 40; bpm < 208;) {
        let dbpm = 8;
        if (bpm >= 40 && bpm < 60) {
            dbpm = 2;
        } else if (bpm >= 60 && bpm < 72) {
            dbpm = 3;
        } else if (bpm >= 72 && bpm < 120) {
            dbpm = 4;
        } else if (bpm >= 120 && bpm < 144) {
            dbpm = 6;
        }
        bpm += dbpm;
        bpms.push(bpm);
    }
}
/* Archivo que contiene el formato de fechas */

export function formattedDate(d) {
    try {
        let month = String(d.getMonth() + 1);
        let day = String(d.getDate());
        const year = String(d.getFullYear());

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return `${year}-${month}-${day}`;

    } catch (e) {
        console.log(e);
    }

}

export function formattedDateAndHour(d) {
    try {
        if (d !== null) {
            let month = String(d.getMonth() + 1);
            let day = String(d.getDate());
            const year = String(d.getFullYear());

            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;

            var h = addZero(d.getHours());
            var m = addZero(d.getMinutes());
            return `${year}-${month}-${day} ${h}:${m}`;
        }

    } catch (e) {
        console.log(e)
    }
}

export function formattedHour(d) {
    try {
        var h = addZero(d.getHours());
        var m = addZero(d.getMinutes());
        return `${h}:${m}`;

    } catch (e) {
        console.log(e)
    }
}

function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

export function formattedStringtoDate(s){
    var d = new Date(s);
    return d;
}
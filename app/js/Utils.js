export default {
    toInitialCaps: function(name) {
        return name.replace(/^[a-z]/, (match) => {
            return String.fromCharCode(match.charCodeAt(0) - 32);
        });
    }
};
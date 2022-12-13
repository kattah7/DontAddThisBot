module.exports = {
	invisChars: new RegExp(/[\u034f\u2800\u{E0000}\u180e\ufeff\u2000-\u200d\u206D]/gu),
	racism: new RegExp(/(?:(?:\b(?<![-=\.])|monka)(?:[Nnñ]|[Ii7]V)|[\/|]\\[\/|])[\s\.]*?[liI1y!j\/|]+[\s\.]*?(?:[GgbB6934Q🅱qğĜƃ၅5\*][\s\.]*?){2,}(?!arcS|l|Ktlw|ylul|ie217|64|\d? ?times)/),
	accents: new RegExp(/[\u0300-\u036f]/g),
	punctuation: new RegExp(/[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g),
	nonEnglish: new RegExp(/[^\x00-\x7F]+/gu),
	slurs: /amerykaniec|angol|arabus|asfalt|bambus|brudas|brudaska|Brytol|chachoł|chinol|ciapaty|czarnuch|fryc|gudłaj|helmut|japoniec|kacap|kacapka|kebab|kitajec|koszerny|kozojebca|kudłacz|makaroniarz|małpa|Moskal|negatyw|parch|pejsaty|rezun|Rusek|Ruska|skośnooki|syfiara|syfiarz|szkop|szmatogłowy|szuwaks|szwab|szwabka|turas|wietnamiec|żabojad|żółtek|żydek|Żydzisko|zabojad|zoltek|zydek|zydzisko|matoglowy|chachol|szuwak|tura|fag|f@g|f@ag|faag|f@gg|fagg|f@gg0|f@ggo/imsu,
	test: new RegExp(/^[A-Z_\d]{4,25}$/i),
};

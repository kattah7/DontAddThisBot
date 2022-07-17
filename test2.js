require("dotenv").config();
const got = require("got");

const getData = async () => {
	try {
		const { body: poggers } =  await got.post(`https://7tv.io/v2/gql`, {
        throwHttpErrors: false,
        responseType: 'json',
        headers: {
            Authorization: process.env.STV_AUTH,
        },
        json: {
            query: "mutation AddChannelEditor($ch: String!, $em: String!, $re: String!) {addChannelEditor(channel_id: $ch, editor_id: $em, reason: $re) {id,editor_ids,editors {id, display_name, login,role { id, name, position, color, allowed, denied },profile_image_url,emote_ids}}}",
            "variables": {
                ch:	"629d77a20e60c6d53da64e38",
                "em": "60b015bce5a579561110d2a2",
                re: ""
            }
        },
    })
		console.log(poggers);
	} catch (err) {
		console.log(err);
	}
};
getData()

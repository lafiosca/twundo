import Twit from 'twit';
import config from './config';

const twit = new Twit(config.twit);

global.window = {
	YTD: {
		like: {
			part0: [],
		},
	},
};

require('./like');

(async () => {
	const likes = window.YTD.like.part0;
	const likeCount = likes.length;
	console.log(`Like count: ${likeCount}`);
	let unlikedCount = 0;
	let notFoundCount = 0;
	let failedCount = 0;
	for (let i = 0; i < likeCount; i += 1) {
		const { like: { tweetId: id } } = likes[i];
		console.log(`Unlike tweet #${i}, id: ${id}`);
		try {
			const result = await twit.post('favorites/destroy', { id });
			const fromUser = (result.data as any)?.user?.screen_name ?? 'unknown';
			console.log(`- Unliked tweet from ${fromUser}`);
			unlikedCount += 1;
		} catch (error) {
			if (error.message === 'No status found with that ID.') {
				console.log('- Tweet not found');
				notFoundCount += 1;
			} else {
				console.log(`- Failed: ${error.message}`);
				failedCount += 1;
			}
		}
		await new Promise((resolve) => setTimeout(resolve, 500));
	}
	console.log(`Unliked count: ${unlikedCount}`);
	console.log(`Not found count: ${notFoundCount}`);
	console.log(`Failed count: ${failedCount}`);
})();

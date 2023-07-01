import Level from "@/components/Level"
import styles from "@/styles/guidelines.module.css"
import Link from "next/link"


export default function Home() {
  return (
    <>
    <div className={styles.banner}></div>
	<h1 className={styles.mom}><strong>Mobile World Records On Extreme Demons</strong></h1>
	<span style={{fontFamily: "Arial", color: "white"}}>
		<div className={styles.indent}>
			<h1> Guidelines </h1>

			<h2> How it works </h2>

			➢ Submitted records are accepted when a player beats a level or reaches the minimum requirements of the correspondent level.
			<br></br>
➢ The minimum requirement for each level corresponds to a higher % than the current record.
<br></br>
➢ If a level doesn&#39;t have any records, the minimum requirement for the World Record is at least 10%.
<br></br>
➢ Only runs from 0% are acceptable as official World Records.
<br></br>
➢ Only rated levels in-game are accepted into this list due to obvious reasons, but of course there are some exceptions (Read further).

<h2> Website Organization </h2>

➢ The website is organized into three different categories.
<br></br>
➢ The <Link href="/">Main List</Link> consists of the same content as <a href="https://www.pointercrate.com" target="_blank" rel="noreferrer">Pointercrate&#39;s Demonlist</a>, the top #1 - #75 hardest Extreme Demons.
<br></br>
➢ The same configuration goes to the <Link href="/extended">Extended List</Link>, including the top #76- #150 from <a href="https://www.pointercrate.com" target="_blank" rel="noreferrer">Pointercrate&#39;s Demonlist.</a>
<br></br>
➢ The <Link href="/legacy">Extra List</Link> consists of all the remaining Extreme Demons rated in-game and demons that are Mobile-List-worthy, organized in alphabetical order.
<br></br>
➢ Inside the <Link href="/legacy">Extra List</Link> there is a second category, which is the Past Rated Extreme Demons. These include the levels that were Extreme Demons but got unrated/updated exclusively. Any levels here must be Extreme Demon worthy to be on there.
<br></br>
➢ Each level has its own position and has the credit for the creators and verifier. Positioning doesn&#39;t apply to the Extra List however.
<br></br>
➢ Here is how a levelcard layout would look like: 
<p></p>
<Level
 n={1}
 name={"Name"}
 ytcode={"oh0FyZHZST8"}
 creator={"Creators"}
 records={[{"name":"Name","percent":["video","screenshot/clip"],"screenshot":false,"link":"https://youtube.com","hertz":"0","_id":"63c0b32328158a91b338558f"}]}
 verifier={"Verifier"}
></Level>
  <br></br><br></br>
<h2> World Records Organization </h2>

➢ World Records are categorized differently depending on the Hz that the player used to achieve it.
<br></br>
➢ Only World Records with videos attached are official World Records for the correspondent level.
<br></br>
➢ For all leaderboard catagories, if there is a screenshot record, it will go in the &quot;Screenshot Records/Completions&quot; category, and there are no exceptions to this.

<h2> Submission Rules </h2>

➢ Check the submission form <a href="https://forms.gle/2UhMp8ravaBKCjpm8" target="_blank" rel="noreferrer">here! </a>
<br></br>
➢ Official records must include a video. The most preferred platforms are Youtube, Twitch and other video sharing/streaming platforms. It is also extremely encouraged for you to upload full videos.
<br></br>
➢ Screenshot submissions are also allowed and will be credited, but are considered as unofficial records, so no points are awarded. Screenshots must also be inside the level, otherwise they won&#39;t be added.
<br></br>
➢ For better chances of getting your record accepted, it is recommended you provide the following to prove your legitimacy:
<p></p>
- Taps (Sound or &quot;circle taps&quot; shown on screen)
<br></br>
- Raw Footage (Full recording)
<br></br>
- Liveplay (External recording of your device&#39;s screen)
<p></p>
➢ Submissions with Liveplay are instantly accepted onto the list.
<br></br>
➢ Other ways of showing your legitimacy are possible, but for common sense, those won&#39;t be listed here.

<h2>Points System & Ranking </h2>

➢ The amount of World Records you have is correspondent to the amount of points you have. Each World Record you hold gives you a point. If you have multiple records on one level (i.e. different refresh rate), only your highest % record will award you points.
<br></br>
➢ Each level you beat as first victor gives you two points instead of one.
<br></br>
➢ Extra List Records work differently than Main List and Extended List Records. Extra List don&#39;t award points, unless it&#39;s a completion, in which awards one point only.
<br></br>
➢ When a new World Record is accepted, the point is transferred from the old World Record holder to the new one.
<br></br>
{"➢ HRR (High Refresh Rates) records are only accepted if higher/tied with the current LRR (Low Refresh Rate / <= 60hz) World Record."}
<br></br>
➢ Unofficial World Record holders won&#39;t be given any points for it. Only Official World Records are worthy points.
<br></br>
➢ (Discord Server) The Discord server awards special roles for World Record holders currently having three of them.                                                                                   
<br></br>
➢ (Discord Server) If you hold 1 WRs, you&#39;ll be given the WR Holder role. The same applies for 5 WRs, however you&#39;ll also be given the WR Pioneer role. If you hold 10 WRs, you&#39;ll finally earn the WR Master role.
<br></br>
➢ (Discord Server) The &#39;👑 #1 Stats Viewer&#39; role is given to the one that is #1 on the Mobile World Records stats viewer, giving exclusive chatting perms.

<h2> Important Links </h2>
➢ Our Official Discord Server
<br></br>
<a href="https://discord.gg/9dgpqqhhc2" target="_blank" rel="noreferrer">Discord Server</a>
{/* <iframe src="https://discord.com/widget?id=530041360443506698&theme=dark" width="250" height="250" allowtransparency="true" frameborder="0" sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"></iframe> */}
<br></br>
➢ Mobile Demonslist
<br></br>
<a href="https://sites.google.com/view/gd-mobile-lists/" target="_blank" rel="noreferrer">Mobile Demons List</a>
<br></br>
➢ Pointercrate Demonslist
<br></br>
<a href="https://pointercrate.com/" target="_blank" rel="noreferrer">Pointercrate</a>
<br></br>
➢ WR/Feedback Submission Form
<br></br>
<a href="https://forms.gle/2UhMp8ravaBKCjpm8" target="_blank" rel="noreferrer">Submission Form</a>
<br></br>
➢ Our GitHub Source Code
<br></br>
<a href="https://github.com/gdhpsk/GDMWRL-NEXTJS" target="_blank" rel="noreferrer">Source Code</a>
<h2>Credits</h2>
{"Special thanks to Ryan9328. They&#39;re the original owner of the code our team tweaked, go check them out."}
<br></br>
<a href="https://www.youtube.com/channel/UCmOyyZSKR9vyItG9dWqNRmA" target="_blank" rel="noreferrer">Ryan9328</a>
<br></br>
<br></br>
Special thanks to Karthik567 for making our Discord server profile picture and current website banners. their Youtube Channel is listed below.
<br></br>
<a href="https://www.youtube.com/channel/UCljIK9jDMCoVkXa3p0lMi4w">Karthik567</a>
<br></br>
<br></br>
<a href="https://www.youtube.com/channel/UCVxyClrBepddN6ordhl1HAw" target="_blank" rel="noreferrer">Venfy</a> - Discord Server Creator & List Moderator
<br></br>
<a href="https://www.youtube.com/channel/UCnlpzjbXM19xJJSdY8ztd_A/videos" target="_blank" rel="noreferrer">hpsk</a> - Website Owner/Main Coder & Discord Moderator
<br></br>
<a href="https://www.youtube.com/channel/UCY9pRLcGO-s2HuA4cfMB-Lw" target="_blank" rel="noreferrer">FrostFoxyn</a> - List Owner & Discord Designer/Moderator
<br></br>
<a href="https://www.youtube.com/c/DashY_GD" target="_blank" rel="noreferrer">DashY</a> - Record Analyzer & List/Discord Moderator
<br></br>
<a href="https://www.youtube.com/channel/UCZEL0trZwcLMt8DQg_UZ5MQ" target="_blank" rel="noreferrer">ssamosa211</a> - List & Discord Moderator
<br></br>
<a href="https://www.youtube.com/channel/UCGf3jnXBQvYWXuIgZWwuoOQ" target="_blank" rel="noreferrer">WhiteEmerald</a> - List & Discord Moderator
<br></br>
<a href="https://www.youtube.com/channel/UCGf3jnXBQvYWXuIgZWwuoOQ" target="_blank" rel="noreferrer">WoodPecker</a> - List Moderator
<br></br>
<s><a href="https://www.youtube.com/channel/UC1H4SlFJs8lGS6pdmHNjwlg" target="_blank" rel="noreferrer">Slinky</a> - List & Discord Moderator</s>
<p></p>

And lastly, thank you for visiting our website. Have a good day. 
<p></p>
   <a href="https://youtu.be/dQw4w9WgXcQ" target="_blank" rel="noreferrer"><button color="white">Full Guidelines</button></a>
</div>
</span>
</>
  )
}

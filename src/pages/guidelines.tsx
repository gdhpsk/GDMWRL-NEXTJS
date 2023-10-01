import Level from "@/components/Level"
import styles from "@/styles/guidelines.module.css"
import Link from "next/link"


export default function Home() {
  return (
    <>
    <div className="bannerfive">
        <h1 className="page-title">Guidelines</h1>
      </div>
	<span style={{fontFamily: "Arial", color: "white"}}>
	<div className={styles.indent}>  
<h2> How This Works </h2>

<br></br>
➢ Submitted records are accepted when a player beats a level or reaches the minimum requirements of the correspondent level.
<br></br>
➢ The minimum requirement for each level corresponds to a higher % than the current record.
<br></br>
➢ If a level doesn&#39;t have any records, the minimum requirement for the World Record is at least 10%.
<br></br>
➢ Only runs from 0% are acceptable as official World Records.
<br></br>
➢ Only rated levels in-game are accepted into this list due to obvious reasons, but of course there are some exceptions (Read further).
<br></br>
<br></br>      
<h2> Website Organization </h2>

<br></br>
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
  <br></br>
    <br></br>
<h2> World Records Organization </h2>

<br></br>
➢ World Records are categorized differently depending on the FPS Value that the player used to achieve it.
<br></br>
➢ Only World Records with videos attached are official World Records for the correspondent level.
<br></br>
➢ For all leaderboard catagories, if there is a screenshot record, it will go in the &quot;Screenshot Records/Completions&quot; category, and there are no exceptions to this.
<br></br>
<br></br>
<h2> Submission Rules </h2>

<br></br>
➢ Check the submission form <a href="https://forms.gle/2UhMp8ravaBKCjpm8" target="_blank" rel="noreferrer">here! </a>
<br></br>
➢ Official records must include a video. The most preferred platforms are Youtube, Twitch and other video sharing/streaming platforms. The whole attempt must be included in the footage to be counted as an official World Record.
<br></br>
➢ Screenshot/Clip submissions are also allowed and will be credited, but are considered as unofficial records, so no points are awarded. Screenshots must be inside the level on the % screen to be added.
<br></br>
➢ All FPS values allowed on the list are based on real mobile devices&#39; capability (Must be available worldwide w/ value present on the main settings).
Current Allowed Values: 30/40/60/90/120/144/165fps
<br></br>
➢ HRR (High Refresh Rates) records are only accepted if higher/tied with the current lower-valued World Record. For an example, 90hz must be equal or higher than 60fps, 120fps must be higher than 90fps/60fps, and so on.
<br></br>
➢ The following hacks/modifications/settings are not acceptable under the lists conditions, and any records with any of these present will not be accepted. Depending on the severity, it may also lead to a ban of the player from the list.
<p></p>
- Speedhack/Force Smooth Fix (lag)
<br></br>
- NoClip/NoSpike/NoHitbox
<br></br>
- IAD&#39;s Physics Bypass
<br></br>
- Invalid FPS/TPS Values
<br></br>
- Botting/Semi-Auto
<p></p>
➢ For better chances of getting your record accepted, it is recommended you provide the following to prove your legitimacy:
<p></p>
- Taps (Sound or &quot;circle taps&quot; shown on screen)
<br></br>
- Raw Footage (Full un-edited recording)
<br></br>
- Liveplay (External recording of your device&#39;s screen)
<p></p>
➢ Other ways of showing your legitimacy are possible, but for common sense, those won&#39;t be listed here.
<br></br>
<br></br>
<h2>Points System & Ranking </h2>

<br></br>
➢ For Main/Extended List, Each World Record gives a point. However, if the World Record is a completion, two points are awarded instead.
<br></br>
➢ Extra List work differently than Main List and Extended List. Extra List Records do not award points, unless it&#39;s a completion, in which case, awards a single point only.
<br></br>
➢ Unofficial World Record holders won&#39;t be given any points for it. Only Official World Records are worthy points.
<br></br>
➢ If the same player obtains multiple records on one level (i.e. different refresh rate), only thr highest % record will award them points.
<br></br>
➢ (Discord Server) The Discord server awards special roles for World Record holders currently having three of them.
<br></br>
➢ (Discord Server) If you hold 1 World Record, you&#39;ll be given the &#34;WR Holder&#34; role. The same applies for 5 World Records, however you&#39;ll also be given the &#34;WR Pioneer&#34; role. If you hold 10 World Records, you&#39;ll earn the &#34;WR Master&#34; role.
<br></br>
➢ (Discord Server) The &#39;👑 #1 Stats Viewer&#39; role is given to the person that is #1 on any of the leaderboards on the Mobile World Records Stats Viewer, awarding exclusive chatting features.
<br></br>
<br></br>
<h2> Important Links </h2>

<br></br>
➢ Our Official Discord Server
<br></br>
<a href="https://discord.gg/9dgpqqhhc2" target="_blank" rel="noreferrer">Discord Server</a>
{/* <iframe src="https://discord.com/widget?id=530041360443506698&theme=dark" width="250" height="250" allowtransparency="true" frameborder="0" sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"></iframe> */}
<br></br>
➢ Mobile Demonlist
<br></br>
<a href="https://sites.google.com/view/gd-mobile-lists/" target="_blank" rel="noreferrer">Mobile DemonList</a>
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
<br></br>
<br></br>
<h2>Credits</h2>
Special thanks to Ryan9328. They are the original owner of the code our team tweaked, go check them out.
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
<a href="https://www.youtube.com/channel/UCY9pRLcGO-s2HuA4cfMB-Lw" target="_blank" rel="noreferrer">FrostSpark</a> - List Owner & Discord Designer/Moderator
<br></br>
<a href="https://www.youtube.com/c/DashY_GD" target="_blank" rel="noreferrer">DashY</a> - Record Analyzer & List/Discord Moderator
<br></br>
<a href="https://www.youtube.com/channel/UCGf3jnXBQvYWXuIgZWwuoOQ" target="_blank" rel="noreferrer">WhiteEmerald</a> - List & Discord Moderator
<br></br>
<a href="https://youtube.com/@cryptoskeyz194" target="_blank" rel="noreferrer">Crypto</a> - List & Discord Moderator
<br></br>
<a href="https://youtube.com/@silence3940" target="_blank" rel="noreferrer">peebodysherman</a> - List & Discord Moderator
<br></br>
<s><a href="https://www.youtube.com/channel/UCZEL0trZwcLMt8DQg_UZ5MQ" target="_blank" rel="noreferrer">ssamosa211</a> - List & Discord Moderator</s>
<br></br>
<s><a href="https://www.youtube.com/channel/UCGf3jnXBQvYWXuIgZWwuoOQ" target="_blank" rel="noreferrer">WoodPecker</a> - List Moderator</s>
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

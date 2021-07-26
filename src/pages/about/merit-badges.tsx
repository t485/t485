import React, { ReactElement } from "react";
import { Layout, SEO } from "../../components/layout";

export default function AboutPage(): ReactElement {
	return (
		<Layout>
			<SEO title="Merit Badges" />
			<h1>Merit Badges</h1>
			<h3 className={"mt-3"}>What are merit badges?</h3>
			<p>
				<img
					src={
						"https://www.verywellfamily.com/thmb/WeKsiTL6-b2UQ3l_ikwts244EBQ=/1885x1414/smart/filters:no_upscale()/eagle-patch-and-merit-badge-sash-on-boy-scout-uniform-865159466-5c3b83f946e0fb0001afbd6c.jpg"
					}
					className="rounded float-right ml-3"
					style={{
						width: "35%",
					}}
				/>
				Merit badge are awards you can earn for completing a set of requirements
				related to a particular merit badge. There are over 130 merit badges,
				each related to a different activity or important skill. In order to
				rank up above first class, you&apos;ll need to earn some merit badges,
				and in order to become an eagle scout, you&apos;ll need to complete at
				least 21 merit badges, 13 specific merit badges that you have to do, and
				8 more of your choice.
			</p>
			<p>
				To learn more about merit badges, and the specific merit badges
				available, you can{" "}
				<a
					href={
						"https://www.scouting.org/programs/scouts-bsa/advancement-and-awards/merit-badges/"
					}
				>
					visit the Boy Scout Website
				</a>
				.
			</p>
			<h3>How can I get a merit badge?</h3>
			<p>
				One way to get merit badges is to attend summer camp. At summer camp,
				scouts typically work on 4-6 merit badges over one week. However,
				it&apos;s generally not possible to do all merit badges during summer
				camps. You may not be able to attend summer camp, or you may be doing a
				very involved merit badge (such as personal fitness or personal
				management, among others). In these cases, you can do a merit badge with
				the troop.
			</p>
			<p>
				It&apos;s easy to start a merit badge! First, you should try to find
				some scouts to do the merit badge together with. Typically, merit badges
				are done in small groups, because it&apos;s more fun to share the
				experience with other scouts, and because of the buddy system. Next,
				you&apos;ll need to get merit badge approval. Here&apos;s the process
				for that:
				<ol>
					<li>
						Research the merit badge, and make sure you know what the
						requirements are and how much of a commitment this particular merit
						badge will be.
					</li>
					<li>
						Email our Scoutmaster and schedule a meeting with him, where you
						will have a short conference with him and a patrol ASM. If the
						scoutmaster believes you’re ready, they will give you their approval
						and also help you find a counselor.
					</li>
					<li>
						Meet with the counselor and fulfill all the requirements. (And don’t
						forget the buddy system!) That’s it!
					</li>
				</ol>
			</p>
		</Layout>
	);
}

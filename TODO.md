# Features to Implement

- Make use of React Context to store the user profile so we can reduce API calls, and also make use of React Context wherever else possible that makes sense, to reduce API Calls.
- Ensure we have a 'Loading' indicator when going across pages or saving?
- For specific areas where we display data from an API, lets display the loading indicator within the component itself.

For example, within Today's Focus component - show a Loading spinner while we wait for the API to retrieve the data.

- Make the Date Picker prettier, we can use whatever the best React library/package there is, I want it to look GOOD (maybe MUI)
- Update the icons for the indivudal substances in the recovery-counter page, make the icons represent what the substance name is, ensure the icons are all consistent, may need to do some custom svg/etc if need


- Get rid of callLambda function, instead, create a services.jsx file that hosts all the REST API calls, I just want a centralized file that has the APIs we can hit so we can just do soomething like import { getJournalEntries } from '...services.jsx' and do like a const response = await getJournalEntries(params if needed) etc with a try catch
- That way we can track state(?) for individual components?

- Cleanup repo wit removing the excessive.MD files and removing possilbe env vars to not get committed
- Add husky / pre-commit hooks, ESLint, Prettier
- Make the Date Picker prettier, we can use whatever the best React library/package there is, I want it to look GOOD (maybe MUI)
- Test to ensure the "Custom Substances" works for multiple substances
- Update the icons for the indivudal substances in the recovery-counter page, make the icons represent what the substance name is, ensure the icons are all consistent, may need to do some custom svg/etc if need

- Implement "Profile" feature where users can view others, a forum for the community posts, users can post specifically to specific sections, possibly a user messaging system?

- BIG FEATURE: Implement official sponsors, users who are willing to sponsor one another

- Nav bar / side bar

- Fix OPENAI API in todayFocus

- Figure out how we can deploy this to production, wehther thats via Github Pages / gh-pages or any alternative (I want to pick something that is FREE)

- Ensure that the deployed app is safe and people cannot hack/inject/vulnerability statements and find the config of my firebase/api keys/config

- Down the road, I believe we want to have a global/centralized table(?) / redo the PK/SK/structure of the items in the table(s) - have a single table, for journal entries maybe have PK: JOURNAL_ENTRY SK: 2025-12-05-entry-1 ... ...

# TODO
- On te RecoveryCounter page, move the "Reset to Today" and "Remove" buttons into a modal, where there is an ellipsis (3 dots) that is horizontal on the card
    - Opening the ellipsis will show the buttons "Reset to Today", "Remove", and more buttons
    - Maybe add a "Relapse" button as well to the dropdown so the user can log a relapse
    - (maybe): Add a "x days sober since y date" instead of just displaying number of days sober, for example, if a user went 30 days sober, then drank one night, the next day, they would be 30/31 days sober(?)
    - Perhaps for users who are not doing abstinence-based recovery, ie: harm reduction, give an option for the user to view Harm Reduction information tailored for that substance
        - Make use of AI to generate harm reduction advice?

# IMPORTANT FEATURE
- Sponsor/Sponsee system to track the work of the 12 steps.
- The sponsor can view the Sponsee's journaling/etc if the Sponsee allows them to.
- Create a system that is built to help 12 step recovery sponsor/sponsee programship/mentorship!
- Tailor AI prompts based off what step the user is currently working
- Or, a user can have no sponsor and specifically make use of AI to be their sponsor
- As the user works the steps, we need the 12 step system where they input data to be more involved, not sure yet how that will look

# IMPORTANT FEATURE
- Create a Terms of Service that the user MUST agree to
    - The user must view and agree to it when they create their account.
    - Specifically outlining that AI is involved in the application, and with other folks


# Business Things to be aware of
- Forming an LLC and hosting the application under the LLC
- Changing the app name based off the LLC
- Changing/creating a new Firebase account based off the LLC
- Changing/creating a new OpenAI account based off the LLC
    - Need to investigate more on the cost/credits used to generate LLM prompts

# Add a “Streak Heatmap” Like GitHub on the Dashboard page.
People LOVE visualizing progress.
Add:
365-day sobriety calendar
colored squares for:
green = no substance use
yellow = mild cravings
red = relapse
This is retention gold.
It motivates the hell out of people. Lets add this to the Dashboard. Make it its own component. 


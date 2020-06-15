import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from "react-router-dom";
import moment from 'moment'

import { ChallengeTabs } from "../components/ChallengeTabs"
import { Overview } from "../components/challenge_tabs/Overview"
import { Timeline } from "../components/challenge_tabs/Timeline"
import { Prizes } from "../components/challenge_tabs/Prizes"
import { Rules } from "../components/challenge_tabs/Rules"
import { Judging } from "../components/challenge_tabs/Judging"
import { HowToEnter } from "../components/challenge_tabs/HowToEnter"
import { Resources } from "../components/challenge_tabs/Resources"
import { FAQ } from "../components/challenge_tabs/FAQ"
import { ContactForm } from "../components/challenge_tabs/ContactForm"
import { Winners } from "../components/challenge_tabs/Winners"

export const DetailsPage = (props) => {

  const [currentChallenge, setCurrentChallenge] = useState()
  const [loadingState, setLoadingState] = useState(false)

  let { challengeId } = useParams();
  const base_url = window.location.origin

  useEffect(() => {
    // TODO: Temporary hiding of layout on chal details until the layout is moved
    $(".top-banner").hide()
    $(".help-section").hide()
    $(".footer").hide()

    let challengeApiPath = base_url + `/api/challenges/${(props.preview ? "preview/" : "")}${challengeId}`

    setLoadingState(true)
    axios
      .get(challengeApiPath)
      .then(res => {
        setCurrentChallenge(res.data)
        setLoadingState(false)
      })
      .catch(e => {
        setLoadingState(false)
        console.log({e})
      })
  }, [])

  const renderEndDate = (date) => {
    const fiveDaysFromNow = moment().add(5,'d').utc().format()
    const withinFiveDays = moment(date).diff(fiveDaysFromNow) <= 0

    if (date >  moment().utc().format()) {
      return (
        <div className="item">
          <p className="info-title">Open until:</p>
          <p>{moment(date).local().format('L LT')}</p>
          { withinFiveDays && <p className="date-qualifier">Closing soon</p> }
        </div>
      )
    } else {
      return (
        <div className="item">
          <p className="info-title">Closed on:</p>
          <p>{moment(date).local().format('L LT')}</p>
        </div>
      )
    }
  }

  const renderChallengeTypes = (types) => {
    return types.map((t, i) => {
      if (i == types.length - 1) {
        return <p key={i}>{t} </p>
      } else {
        return <p key={i}>{t}, </p>
      }
    })
  }

  return (
    <div>
      {currentChallenge &&
        <div>
          <section className="hero__wrapper" aria-label="Challenge overview details">
            <section className="hero__content">
              <div className="main-section">
                <div className="main-section__text">
                  { currentChallenge.logo &&
                    <div className="logos">
                      <img
                        className="agency-logo"
                        src={currentChallenge.agency_logo}
                        alt={`${currentChallenge.agency_name} logo`}
                        title="Challenge agency logo" />
                      { (currentChallenge.federal_partners.length > 0 && currentChallenge.federal_partners[0].logo) &&
                        <img
                          className="agency-logo"
                          src={currentChallenge.federal_partners[0].logo}
                          alt={`${currentChallenge.federal_partners[0].name} logo`}
                          title="Federal partner agency logo"/>
                      }
                    </div>
                  }
                  <h1 className="title">{currentChallenge.title}</h1>
                  <h3 className="tagline">{currentChallenge.tagline}</h3>
                  <p className="brief_description">{currentChallenge.brief_description}</p>
                </div>
                <div className="logo-container">
                  { currentChallenge.logo
                    ? <img
                        className="challenge-logo"
                        src={currentChallenge.logo} alt="challenge logo"
                        title="challenge logo"/>
                    : <img
                        className="agency-logo"
                        src={currentChallenge.agency_logo}
                        alt={`${currentChallenge.agency_name} logo`}
                        title="Challenge agency logo" />
                  }
                </div>
              </div>
              <div className="detail-section">
                { currentChallenge.end_date >  moment().utc().format() &&
                  <>
                    <div className="detail-section__apply">
                      { currentChallenge.external_url ? 
                      <a href={`${currentChallenge.external_url}`} target="_blank">
                        <button className="apply-btn">Apply on external website <i className="fa fa-external-link-alt ml-3"></i></button>
                      </a>
                      :
                      <a href={`/challenges/${currentChallenge.id}/solutions/new`}>
                        <button className="apply-btn">Apply for this challenge</button>
                      </a>
                      }
                    </div>
                    <div className="detail-section__follow">
                      <a href={`/challenges/${currentChallenge.id}/save_challenge/new`}>
                        <button className="follow-btn"><i className="far fa-bookmark mr-3"></i>Follow challenge</button>
                      </a>
                    </div>
                  </>
                }
                <div className="item">
                  <p className="info-title">Submission period:</p>
                  { currentChallenge.end_date >  moment().utc().format()
                    ? <p>Open</p>
                    : <p>Closed</p>
                  }
                </div>
                {renderEndDate(currentChallenge.end_date)}
                <div className="item">
                  { currentChallenge.types.length > 1
                    ? <p className="info-title">Challenge types:</p>
                    : <p className="info-title">Challenge type:</p>
                  }
                  {renderChallengeTypes(currentChallenge.types)}
                </div>
                { !currentChallenge.prize_total || currentChallenge.prize_total != 0 &&
                  <div className="item">
                    <p className="info-title">Total cash prizes:</p>
                    <p>{`$${currentChallenge.prize_total.toLocaleString()}`}</p>
                  </div>
                }
              </div>
            </section>
          </section>
          <ChallengeTabs>
            <div label="Overview">
              <Overview challenge={currentChallenge} />
            </div>
            { currentChallenge.events.length > 0 &&
              <div label="Timeline">
                <Timeline challenge={currentChallenge} />
              </div> 
            }
            <div label="Prizes">
              <Prizes challenge={currentChallenge} />
            </div>
            <div label="Rules">
              <Rules challenge={currentChallenge} />
            </div>
            <div label="Judging">
              <Judging challenge={currentChallenge} />
            </div>
            <div label="How to enter">
              <HowToEnter challenge={currentChallenge} />
            </div>
            { currentChallenge.supporting_documents.length > 0 &&
              <div label="Resources">
                <Resources challenge={currentChallenge} />
              </div>
            }
            <div label="FAQ">
              <FAQ challenge={currentChallenge} />
            </div>
            <div label="Contact">
              <ContactForm />
            </div>
            <div label="Winners" disabled={!currentChallenge.winner_information} >
              <Winners challenge={currentChallenge} />
            </div>
          </ChallengeTabs>
        </div>
      }
    </div>
  )
}

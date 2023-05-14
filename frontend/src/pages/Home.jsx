import React, { useContext } from 'react'
import { LinkContex } from '../contex/LinkContex';
import DescriptionIcon from '@mui/icons-material/Description';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import { useNavigate } from 'react-router-dom';
function Home() {

  const { links } = useContext(LinkContex);

  const navigate = useNavigate();

  return (
    <div className="right">
      {
        links != null &&
        <>
          {
            links.length ?
              <div className='section-conta'>
                <h1>Sections : </h1>

                <div className="section-container">
                  {
                    links.map((link) => (
                      <div onClick={() => {
                        navigate(link._id)
                      }} className="small-section" key={link._id}>
                        <DescriptionIcon />
                        {link.title}
                      </div>
                    ))
                  }
                </div>
              </div>
              : <div className='add_any_section'>
                <h2>Add One Section</h2>
                <CreateNewFolderIcon style={{ fontSize: "max(20vw,5rem)", color: "grey" }} />
              </div>
          }
        </>
      }
    </div>
  )
}

export default Home
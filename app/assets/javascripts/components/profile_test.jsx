
var ProfileTest = React.createClass({
  getInitialState: function() {
    return {save_needed: false,
            bio: this.props.user.bio,
            first_name: this.props.user.first_name,
            age: this.props.user.age,
            buttonColor: 'col-xs-6'};
  },
  componentDidMount: function() {
    var that = this
    $(document).keyup(function() {
      setTimeout(function(){that.refs.saveButton.quickSave()}, 400)
      })
  },
  updateButtonColor: function() {
    this.setState({ buttonColor: 'col-xs-6 can_save'});
  },
  onClick: function() {
    this.setState({ name_form: true});
    this.updateSaveNeeded()
  },
  updateBio: function(new_bio){
    this.setState({bio: new_bio});
    this.updateSaveNeeded()
  },
  updateName: function(first_name){
    this.setState({first_name: first_name})
    this.updateSaveNeeded()
  },
  updateAge: function(age){
    this.setState({age: age})
    this.updateSaveNeeded()
  },
  updateSaveNeeded: function() {
    if ((this.state.bio) && (this.state.bio.length > 0)) {
      this.updateButtonColor();
      $('#save_button').prop("disabled", false);
      $('#save_button').addClass('can_save');
      this.setState({save_needed: true});
    }
  },

  logout: function() {
    $.ajax({
      url: '/users/sign_out',
      type: 'DELETE',
      success: function(data) {
        window.location.replace('/');
      }.bind(this)
    });
  },
  render: function() {
    return(
      <div>
        <form>
        <div className="profile-row">
           <img className="profile-pic" src={this.props.user.profile_picture_url} alt="Profile Picture" />
           <div className="profile-text name-age">
             <Name updateName={this.updateName} first_name={this.state.first_name} changeToSave={this.updateSaveNeeded} />, <Age updateAge={this.updateAge} age={this.state.age} changeToSave={this.updateSaveNeeded}/>
           </div>
         </div>
         <div id="profile_text" className="profile-text">
         <Bio updateBio={this.updateBio} bio={this.state.bio} changeToSave={this.updateSaveNeeded}/>
         </div>
       </form>
       <div className="footer">
       <button className="col-xs-6" onClick={this.logout}>Logout</button>
        <SaveButton buttonColor={this.state.buttonColor} ref="saveButton" firstVisit={this.props.first_visit} userId={this.props.user.id} bio={this.state.bio} first_name={this.state.first_name} age={this.state.age} />
        </div>
       </div>
      )
  }
})

var Name = React.createClass({
  getInitialState: function() {
    return { form: false,
              first_name: this.props.first_name,
              size: this.props.first_name.length};
  },
  onClick: function() {
    var current_form = this.state.form
    this.setState({ form: !current_form});
  },
  handleChange: function(event) {
    this.setState({first_name: this.refs.first_name.value, size: this.refs.first_name.value.length});
    this.props.updateName(this.refs.first_name.value)
    this.props.changeToSave();
  },
  render: function() {
    if (this.state.form) {
      return(
          <input type="text" className="inline" autoFocus ref="first_name" id='first_name' size={this.state.size} onChange={this.handleChange} defaultValue={this.state.first_name}></input>
        );
        } else {
          return(<span id='first_name' onClick={this.onClick} >{this.state.first_name}</span>);
        }
  }
})

var Age = React.createClass({
  getInitialState: function() {
    return { form: false,
              age: this.props.age,
              size: 2};
  },
  componentDidMount: function() {
    if (this.props.age == "" || !this.props.age) {
      this.setState({form: true});
    }
  },
  onClick: function() {
    var current_form = this.state.form
    this.setState({ form: !current_form});
  },
  handleChange: function(event) {
    if (event.target.value.length > 2) {
      var new_age = event.target.value.slice(0,2)
      this.setState({age: new_age});
      this.props.updateAge(new_age)
      this.props.changeToSave();
    } else {
    this.setState({age: event.target.value});
    this.props.updateAge(this.refs.age.value)
    this.props.changeToSave();
    }
  },
  render: function() {
    if (this.state.form) {
      return(
          <input className="inline number_form" type="number" autoFocus ref="age" id='age' maxLength="2" max="99" onChange={this.handleChange} defaultValue={this.state.age} placeholder="age"></input>
        );
        } else {
          return(<span id='age' onClick={this.onClick}>{this.state.age}</span>);
        }
  }
})

var Bio = React.createClass({
  getInitialState: function() {
    return {  bio: this.props.bio,
              color_class: 'has-error',
              form: false
            };
  },
  componentDidMount: function() {
    if(this.props.firstVisit || !this.props.bio || this.props.bio.length < 0) {
      this.setState({form: true});
    } else {
      this.setState({form: false});
    }
  },
  onClick: function() {
    var current_form = this.state.form
    this.setState({ form: !current_form});
  },
  handleChange: function(event) {
    this.props.updateBio(event.target.value);
  },
  render: function() {
    let maybe_red_form = (!this.props.bio || this.props.bio.length < 0) ?
                          this.state.color_class :
                          '';
    let placeholderText = 'I played varsity tennis in high school in Houston, and moved to SF after college in 2010...';
    if (this.state.form ) {
      return(
        <div className={maybe_red_form}>
          <textarea autoFocus
            id='bio' rows="4" columns="20"
            className="form-control"
            onChange={this.handleChange}
            placeholder={placeholderText} >
              {this.state.bio}
            </textarea>
        </div>
      );
    } else {
      return(<span id='bio' onClick={this.onClick} >{this.state.bio}</span>);
    }
  }
})

var SaveButton = React.createClass({
  getInitialState: function() {
    return { buttonText: 'Save changes',
              target: 'users/'};
  },
  componentDidMount: function() {
    this.quickSave();
    if(this.props.firstVisit) {
      this.setState({buttonText: 'Start Swiping!'})
    } else {
      this.setState({buttonText: 'Save Changes'})
    }
  },
  render: function() {
    return (
    <input onClick={this.onClick} type="submit" name="/edit_profile" id="save_button" className={this.props.buttonColor} value={this.state.buttonText}></input>
    )
  },
  onClick: function() {
    if (this.props.bio.length > 0) {
      this.saveForm()
    } else {
    }
  },
  quickSave: function(){
    var request = $.ajax({
                    url: '/update_profile',
                    type: "PUT",
                    data: {first_name: this.props.first_name, age: this.props.age, bio: this.props.bio}
                    });

    request.done(function(data) {
    });
  },

  saveForm: function(){
    var firstVisit = this.props.firstVisit
    var request = $.ajax({
                    url: '/update_profile',
                    type: "PUT",
                    data: {first_name: this.props.first_name, age: this.props.age, bio: this.props.bio}
                    });

    request.done(function(data) {
        if(firstVisit) {
          location.href = '/feed';
        } else {
        location.reload();
        }
    });
  },
});




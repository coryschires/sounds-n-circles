class PublicPagesController < ApplicationController
  def home
    @recent_favorites = [
      {:title => "Rercursive Circles and Bells",
      :description => "Lorem vipsum dolor sit amet, consectetur adipisicing dolor elit.",
      :published_at => "March 24, 2010",
      :user => "coryschires"},
      {:title => "Circles and Bells",
      :description => "Lorem vipsum dolor sit amet, consectetur adip isicing dolor elit dolor sit amet, consectetur.",
      :published_at => "March 6, 2010",
      :user => "wolfbait"},
      {:title => "Rercursive Circles and Bells",
      :description => "Lorem vipsum dolor sit amet, consectetur adipisicing dolor elit.",
      :published_at => "April 28, 2010",
      :user => "newwave"},
      {:title => "Rercursive Circles and Bells",
      :description => "Lorem vipsum dolor sit amet, consectetur adip isicing dolor elit dolor sit amet, consectetur adipisicing.",
      :published_at => "March 1, 2010",
      :user => "someone"},
      {:title => "Rercursive Circles and Bells",
      :description => "Lorem vipsum dolor sit amet, consectetur adip isicing dolor elit dolor sit amet.",
      :published_at => "March 12, 2010",
      :user => "edhardy"}
    ]

    
  end

end

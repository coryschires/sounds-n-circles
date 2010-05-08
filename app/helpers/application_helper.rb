module ApplicationHelper

  def processing_canvas(id)
    canvas = "<canvas id='#{id}'></canvas>"
    content_tag(:div, raw(canvas), :id => "processing_canvas")
  end
  
end